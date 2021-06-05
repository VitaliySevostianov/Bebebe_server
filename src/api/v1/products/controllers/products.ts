import express from 'express';
import { Body, Tags, Controller, Get, Path, Post, Put, Delete, Route, Request, Security, Query } from 'tsoa';
import { IProductCreationParams, IProductParams, IProductResponse, IProductsResponse, ProductsSortEnum } from 'lib/v1/interfaces/products';
import { ProductsService } from 'lib/v1/services/products';

import { OrderEnum, SuccessMessageResponse } from 'lib/v1/interfaces/public';

@Route('products')
@Tags('Products')
// @Security('jwt', ['write', 'read'])
export class ProductsController extends Controller {
	/**
	 * Принимает id продукта, возвращает данные о нём.
	 * @param productId Идентификатор продукта
	 * @example productId 1
	 */
	@Get('{productId}')
	public async get(@Path() productId: string): Promise<IProductResponse> {
		return new ProductsService().get(productId);
	}

	/**
	 *Возвращает список продуктов.
	 */
	@Get()
	public async getAll(@Query() page?: number, @Query() owner?: string, @Query() sort?: ProductsSortEnum, @Query() order?: OrderEnum): Promise<IProductsResponse> {
		return new ProductsService().getAll(page, owner, sort, order);
	}

	/**
	 * Принимает id продукта, изменяет любые данные о нем
	 * @param productId Идентификатор продукта
	 * @example productId 1
	 */
	@Put('{productId}')
	public async update(@Path() productId: string, @Body() requestBody: IProductParams): Promise<IProductResponse> {
		return new ProductsService().update(productId, requestBody);
	}

	/**
	 *	Прикрепление катинки к существующему продукту(в теле запроса должен находится файл в multipart/form-data формате, в документации это не может отобразится)
	 * @param productId id заявки
	 * @example productId 4
	 */
	@Put('{productId}/images')
	public async addDocuments(@Path() productId: string, @Request() request: express.Request): Promise<SuccessMessageResponse> {
		return new ProductsService().addDocuments(productId, request);
	}

	/**
	 * Принимает id продукта, удаляет этот продукт
	 * @param productId Идентификатор продукта
	 * @example productId 1
	 */
	@Delete('{productId}')
	public async delete(@Path() productId: string): Promise<SuccessMessageResponse> {
		return new ProductsService().delete(productId);
	}

	/**
	 * Принимает возможные данные о продукте и создает его
	 * @param requestBody Возможные данные
	 */
	@Post()
	public async create(@Body() requestBody: IProductCreationParams): Promise<IProductResponse> {
		return new ProductsService().create(requestBody);
	}

}
