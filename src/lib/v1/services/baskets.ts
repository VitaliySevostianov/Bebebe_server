// src/passengers/usersService.ts
import { IBasketResponse, IBasketUpdateRequest, IBasketCreationParams, IBasketsResponse} from 'lib/v1/interfaces/baskets';
// import Database from 'lib/v1/models/passengers';
import {Basket as Database} from 'lib/v1/models/baskets';

import ProductsDB from 'lib/v1/models/products';
import ProductsSetDB from 'lib/v1/models/productsSet';
import { validate, createBasket } from 'lib/v1/helpers/baskets';
import { SuccessMessageResponse } from 'lib/v1/interfaces/public';

export class BasketsService {
	public async get(basketId: string, status?: any): Promise<IBasketsResponse> {
		try {
			const query: any = {
				basketId
			}
			
			if(status){
				if(status.length !== 0){
					status.splice(status.indexOf(''), 1) 
					query.status = {'$in': status}
				}
			}
			const baskets: any = await Database.find(query);
			console.log(baskets);
			if (baskets) {
				return {
					success: true,
					baskets,
				};
			} else {
				throw new Error('Basket not found');
			}
		} catch (e) {
			throw new Error(e);
		}
	}

	public async getAll(page: number = 0, onPageLimit: number = 50, status?: any): Promise<IBasketsResponse> {
		try {
			let baskets: any
			const findParams: any = {}
			const pipeline = []
			
			if(status){
				if(status.length !== 0){
					status.splice(status.indexOf(''), 1) 
					findParams.status = {'$in': status}
				}
			}
			pipeline.push({
				$match: findParams
			})
			pipeline.push({
				$skip: onPageLimit * page
			})
			pipeline.push({
				$limit: onPageLimit
			})
		
			baskets = await Database.aggregate(pipeline);
			// console.log(passengers)
			const totalObjects = await Database.countDocuments(findParams)
			
			return {
				success: true,
				pagesAmount: Math.ceil(totalObjects / onPageLimit),
				baskets,
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async updateBasket(userId: string,requestBody: IBasketUpdateRequest, sellerId: string ): Promise<IBasketResponse> {
		try {
			const query: any = {userId, sellerId}
			// if(sellerId){
			// 	query.sellerId = sellerId
			// }

			const basket: any = await Database.findOne(query).select('-_id');

			let item;
			let product;
			// console.log(requestBody.position)
			if (requestBody.position !== undefined && basket.items !== undefined && basket.items[0] !== undefined) {
				console.log(requestBody.position)
				console.log(basket.items[0])
				item = basket.items[requestBody.position];
				product = await ProductsDB.findOne({ id: item.productId });
			} else if (requestBody.newItem) {
				console.log('requestBody', requestBody)
				item = basket.items.find((item) => item.productId === requestBody.newItem.productId);

				product = await ProductsDB.findOne({ id: requestBody.newItem.productId });
			}
			console.log(item)

			console.log(product)
			if (requestBody.action === 'delete' && requestBody.position !== undefined && basket.items[0] !== undefined) {
				basket.items.splice(requestBody.position, 1);
				basket.totalPrice -= product.price * item.amount;
			} else if (requestBody.action === 'add') {
				if (item) {
					const index = basket.items.indexOf(item);
					basket.items[index].amount += requestBody.newItem.amount;
				} else {
					basket.items.push({
						productId: requestBody.newItem.productId,
						amount: requestBody.newItem.amount,
						price: product.price,

					});
				}
				basket.totalPrice += product.price * requestBody.newItem.amount;
			} else if (requestBody.action === 'update') {
				basket.items[requestBody.position].amount = requestBody.newAmount;
				if (requestBody.newAmount > item.amount) {
					const difference = requestBody.newAmount - item.amount;
					basket.totalPrice += product.price * difference;
				} else if (requestBody.newAmount < item.amount) {
					const difference = item.amount - requestBody.newAmount;
					basket.totalPrice -= product.price * difference;
				}
			} else if (requestBody.action === 'incrementAmount') {
				basket.items[requestBody.position].amount += 1;
				basket.totalPrice += product.price;
			} else if (requestBody.action === 'decrementAmount') {
				basket.items[requestBody.position].amount -= 1;
				basket.totalPrice -= product.price;
			} else if (requestBody.action === 'updateStatus') {
				// basket.items[requestBody.position].amount -= 1;
				if(requestBody.newStatus) {
					basket.status = requestBody.newStatus;
				} else {
					throw new Error('You should set newStatus parameter to update basket status')
				}
			}
			if (basket.totalPrice < 0) {
				basket.totalPrice = 0;
			}
			console.log(basket)
			await Database.updateOne(
				query,
				{
					$set: basket,
				},
				{
					runValidators: true,
				},
			);
			return {
				success: true,
				basket: basket,
			};
	
		} catch (e) {
			throw new Error(e);
		}
	}

	public async updateBasketByBasketId(basketId: string,requestBody: IBasketUpdateRequest): Promise<IBasketResponse> {
		try {
			const basket: any = await Database.findOne({ basketId }).select('-_id');
			console.log(requestBody)
			if (requestBody.action === 'addPayment') {
			
			
				basket.items.push({
					price: requestBody.newPayment.price,
				});
				
				basket.totalPrice += requestBody.newPayment.price;

				await Database.updateOne(
					{ basketId },
					{
						$set: basket,
					},
					{
						runValidators: true,
					},
				);
				return {
					success: true,
					basket: basket,
				};
			} else {
			let item;
			let product;
			// console.log(requestBody.position)
			if (requestBody.position !== undefined && basket.items !== undefined && basket.items[0] !== undefined) {
				console.log(requestBody.position)
				console.log(basket.items[0])
				item = basket.items[requestBody.position];
			} else if (requestBody.newItem) {
				console.log('requestBody', requestBody)
				item = basket.items.find((item) => item.productId === requestBody.newItem.productId && item.productType === requestBody.newItem.productType);
			}
			console.log(item)

			console.log(product)
			if (requestBody.action === 'delete' && requestBody.position !== undefined && basket.items[0] !== undefined) {
				basket.totalPrice -= basket.items[requestBody.position].price * basket.items[requestBody.position].amount;
				basket.items.splice(requestBody.position, 1);
				
			}else if (requestBody.action === 'add') {
				if(requestBody.newItem.productType === 'set'){
					product = await ProductsSetDB.findOne({id: requestBody.newItem.productId})
				} else {
					product = await ProductsDB.findOne({id: requestBody.newItem.productId})
				}
				
				if (item) {
					const index = basket.items.indexOf(item);
					basket.items[index].amount += requestBody.newItem.amount;
				} else {
					basket.items.push({
						productType: requestBody.newItem.productType,
						productId: requestBody.newItem.productId,
						amount: requestBody.newItem.amount,
						price: product.price,

					});
				}
				basket.totalPrice += product.price * requestBody.newItem.amount;
			} else if (requestBody.action === 'update') {
				basket.items[requestBody.position].amount = requestBody.newAmount;
				if (requestBody.newAmount > item.amount) {
					const difference = requestBody.newAmount - item.amount;
					basket.totalPrice += product.price * difference;
				} else if (requestBody.newAmount < item.amount) {
					const difference = item.amount - requestBody.newAmount;
					basket.totalPrice -= product.price * difference;
				}
			} else if (requestBody.action === 'incrementAmount') {
				basket.items[requestBody.position].amount += 1;
				basket.totalPrice += basket.items[requestBody.position].price;
			} else if (requestBody.action === 'decrementAmount') {
				basket.items[requestBody.position].amount -= 1;
				basket.totalPrice -= basket.items[requestBody.position].price;
			} else if (requestBody.action === 'updateStatus') {
				// basket.items[requestBody.position].amount -= 1;
				if(requestBody.newStatus) {
					basket.status = requestBody.newStatus;
				} else {
					throw new Error('You should set newStatus parameter to update basket status')
				}
			}
			if (basket.totalPrice < 0) {
				basket.totalPrice = 0;
			}
			console.log(basket)
			await Database.updateOne(
				{ basketId },
				{
					$set: basket,
				},
				{
					runValidators: true,
				},
			);
			return {
				success: true,
				basket: basket,
			};
		}
		} catch (e) {
			throw new Error(e);
		}
	}

	public async delete(basketId: string): Promise<SuccessMessageResponse> {
		try {
			const query: any = {}

			if(basketId) query.basketId = basketId
			await Database.deleteOne(query);
			return {
				success: true,
				message: 'Basket was deleted',
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async create(creationParams: IBasketCreationParams): Promise<IBasketResponse | any> {
		try {
			Database.syncIndexes();
			
			function makeid(length) {
				var result           = [];
				var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				var charactersLength = characters.length;
				for ( var i = 0; i < length; i++ ) {
				  result.push(characters.charAt(Math.floor(Math.random() * 
			 charactersLength)));
			   }
			   return result.join('');
			}
			
			console.log(creationParams)
			const data = {
				...creationParams,
				status: 'notPaid',
				basketId: makeid(20),
				totalPrice: 0,
				timestamp: new Date().toISOString()
			}
			await validate(data);
			const basket: any = await createBasket(data);
			return {
				success: true,
				basket,
			};
		} catch (e) {
			throw new Error(e);
		}
	}
}
