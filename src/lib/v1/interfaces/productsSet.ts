import { IProductSet } from 'lib/v1/models/productsSet';

export interface IProductSetParams {
		/**
	 * Наименование
	 * @example	"Молоко"
	 */

	name?: IProductSet['name'];
	description?: IProductSet['description'];
	items?: IProductSet['items']
	/**
	 * Стоимость (назначается продавцом) 
	 * @example	55
	 */
	price: IProductSet['price'];
	/**
	 * Фото
	 */
	images?: IProductSet['images'];

}

export interface IProductSetCreationParams {
	/**
 * Наименование
 * @example	"Молоко"
 */

name?: IProductSet['name'];
description?: IProductSet['description'];
items: IProductSet['items']
/**
 * Стоимость (назначается продавцом) 
 * @example	55
 */
price: IProductSet['price'];

}

export interface IProductSetResponse {
	success: boolean;
	product: IProductSetParams;
}

export interface IProductSetsResponse {
	success: boolean;
	products: IProductSetParams[];
}


export type ProductsSetSortEnum = 'name'
