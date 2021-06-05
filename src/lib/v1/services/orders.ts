import { IOrderCreationParams, IOrderParams, IOrderResponse, IOrdersResponse } from 'lib/v1/interfaces/orders';
import Database from 'lib/v1/models/orders';
import { validate, createOrder } from 'lib/v1/helpers/orders';
import { SuccessMessageResponse } from 'lib/v1/interfaces/public';

import multer from 'multer'

export class OrdersService {
	public async getAll(): Promise< IOrdersResponse> {
		try {
			const orders: any = await Database.find({});
			return {
				orders,
				success: true
			}
		} catch (e) {
			throw new Error(e);
		}
	}
	public async get(id: string): Promise< IOrderResponse> {
		try {
			const order: any = await Database.findOne({ id });
			console.log(order);
			if (order) {
				return {
					success: true,
					order,
				};
			} else {
				throw new Error('Order not found');
			}
		} catch (e) {
			throw new Error(e);
		}
	}

	public async delete(id: string): Promise<SuccessMessageResponse> {
		try {
			await Database.deleteOne({ id: id });
			return {
				success: true,
				message: 'Order was deleted',
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async create(productCreationParams:  IOrderCreationParams): Promise< IOrderResponse> {
		try {
			await validate(productCreationParams);
			const order = await createOrder(productCreationParams);
			return {
				success: true,
				order,
			};
		} catch (e) {
			throw new Error(e);
		}
	}
}
