import { IOrder } from 'lib/v1/models/orders';

export interface IOrderParams {
	name: IOrder['name'],
	phone: IOrder['phone'],
	basketId: IOrder['basketId'],
}

export interface IOrderCreationParams {
	name: IOrder['name'],
	phone: IOrder['phone'],
	basketId: IOrder['basketId'],
}

export interface IOrderResponse {
	success: boolean;
	order: IOrderParams;
}
export interface IOrdersResponse {
	success: boolean;
	orders: IOrderParams[];
}

// export interface IProductSetsResponse {
// 	success: boolean;
// 	// products: IProductSetParams[];
// }
