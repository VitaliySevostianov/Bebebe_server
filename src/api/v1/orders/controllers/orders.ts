import express from 'express';
import { Body, Tags, Controller, Get, Path, Post, Put, Delete, Route, Request, Security, Query } from 'tsoa';
import {  IOrderCreationParams,  IOrderParams,  IOrderResponse, IOrdersResponse } from 'lib/v1/interfaces/orders';
import { ProductsSetService } from 'lib/v1/services/productsSet';

import { OrderEnum, SuccessMessageResponse } from 'lib/v1/interfaces/public';
import { OrdersService } from 'lib/v1/services/orders';

@Route('orders')
@Tags('Orders')
// @Security('jwt', ['write', 'read'])
export class OrdersController extends Controller {

	 @Get()
	 public async getAll(): Promise< IOrdersResponse> {
		 return new OrdersService().getAll();
	 }

	@Get('{orderId}')
	public async get(@Path() orderId: string): Promise< IOrderResponse> {
		return new OrdersService().get(orderId);
	}

	@Delete('{orderId}')
	public async delete(@Path() orderId: string): Promise<SuccessMessageResponse> {
		return new OrdersService().delete(orderId);
	}

	/**
	 * Принимает возможные данные о заказе и создает его
	 * @param requestBody Возможные данные
	 */
	@Post()
	public async create(@Body() requestBody:  IOrderCreationParams): Promise< IOrderResponse> {
		return new OrdersService().create(requestBody);
	}

}
