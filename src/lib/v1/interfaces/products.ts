import { IProduct } from 'lib/v1/models/products';

export interface IProductParams {
		/**
	 * Наименование
	 * @example	"Молоко"
	 */

	name?: IProduct['name'];
	description?: IProduct['description'];
	/**
	 * Стоимость (назначается продавцом) 
	 * @example	55
	 */
	price: IProduct['price'];
	/**
	 * Фото
	 */
	images?: IProduct['images'];

}

export interface IProductCreationParams {
	/**
 * Наименование
 * @example	"Молоко"
 */

name?: IProduct['name'];
description?: IProduct['description'];
/**
 * Стоимость (назначается продавцом) 
 * @example	55
 */
price: IProduct['price'];

}

export interface IProductResponse {
	success: boolean;
	product: IProductParams;
}

export interface IProductsResponse {
	success: boolean;
	products: IProductParams[];
}


export type ProductsSortEnum = 'name'
