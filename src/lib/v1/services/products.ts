import path from 'path';
import fs from 'fs'
import { IProductCreationParams, IProductParams, IProductResponse, IProductsResponse } from 'lib/v1/interfaces/products';
import Database from 'lib/v1/models/products';
import { validate, createProduct } from 'lib/v1/helpers/products';
import { SuccessMessageResponse } from 'lib/v1/interfaces/public';

import multer from 'multer'

export class ProductsService {
	public async get(id: string): Promise<IProductResponse> {
		try {
			const product: any = await Database.findOne({ id });
			console.log(product);
			if (product) {
				return {
					success: true,
					product,
				};
			} else {
				throw new Error('Product not found');
			}
		} catch (e) {
			throw new Error(e);
		}
	}

	public async getAll(page?: number,owner?: string, sort?: string, order?: string): Promise<IProductsResponse> {
		try {

			const query: any = owner !== undefined ? owner.split(',').map((item) => {
				return item
			}) : ''
			console.log(query)
			// query.length > 1 ?  : 
			let products: any[]
			const pipeline: any = [
				sort === 'name' ? { $sort: { 'name': order === 'reverse' ? -1 : 1 } } : { $sort: {total: 1} },
				{
					$match: owner !== undefined ? { userId: { $in: query } } : {}
				}
			]
			if (page !== undefined && page > 0) {
				pipeline.push({
					$skip: 50 * (page - 1)
				})
				pipeline.push({
					$limit: 50
				})
			}
			products = await Database.aggregate(pipeline)
			console.log(products)

			return {
				success: true,
				products,
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async update(id: string, requestBody: IProductParams): Promise<any> {
		try {
			const product = await Database.updateOne(
				{ id },
				{
					$set: requestBody,
				},
				{
					runValidators: true,
				},
			);
			return {
				success: true,
				product,
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async updateCourse(id: string, requestBody: {courses: {}}): Promise<any> {
		try {
			const product = await Database.updateOne(
				{ id },
				{
					$set: requestBody,
				},
				{
					runValidators: true,
				},
			);
			return {
				success: true,
				product,
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async addDocuments(id: string, req: any): Promise<SuccessMessageResponse> {
		console.log('id', id)
		// console.log(req)
		// console.log(req.rawBody)
		// const files = req.files || req.body.files;
		// const keys = Object.keys(files);
		// const imagesToPin = [];
		// keys.forEach((key: any, i) => {
		// 	const file = files[key];
		// 	console.log('path', path.join(__dirname, '../../../outputs/documents/' + file.name))
		// 	const filePath = path.join(__dirname, '../../../outputs/documents/' + file.name);
		// 	console.log(file.mimetype);
		// 	if (file.mimetype  === 'image/png' || file.mimetype === 'image/jpg') {
		// 		const data = {
		// 			name: file.name,
		// 			mimetype: file.mimetype,
		// 			size: file.size,
		// 			path: filePath,
		// 		};
		// 		imagesToPin.push(data);
		// 		file.mv(filePath);
		// 	}
		// });
		// console.log(imagesToPin);
		console.log(req.files)
		const file = req.files.files[0]
		fs.writeFile(path.join(__dirname, '../../../outputs/documents/' + file.originalname), file.buffer, (e) => console.log(e))
		// const file = req.file
		console.log(file)
		const data = {
			name: file.originalname,
			mimeType: file.mimetype,
			size: file.size,
			path: file.path,			
		}
		await Database.updateOne(
			{ id },
			{
				$set: { images: [data] },
			},
			{
				runValidators: true,
			},
		);
		return {
			success: true,
			message: 'Images were pinned',
		};
	}

	public async delete(id: string): Promise<SuccessMessageResponse> {
		try {
			await Database.deleteOne({ id: id });
			return {
				success: true,
				message: 'Product was deleted',
			};
		} catch (e) {
			throw new Error(e);
		}
	}

	public async create(productCreationParams: IProductCreationParams): Promise<IProductResponse> {
		try {
			await validate(productCreationParams);
			const product = await createProduct(productCreationParams);
			return {
				success: true,
				product,
			};
		} catch (e) {
			throw new Error(e);
		}
	}
}
