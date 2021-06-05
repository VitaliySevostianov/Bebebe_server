import express from 'express';
import { Body, Tags, Controller, Get, Path, Post, Put, Delete, Route, Request, Security, Query } from 'tsoa';
import { IProductSetCreationParams, IProductSetParams, IProductSetResponse, IProductSetsResponse, ProductsSetSortEnum } from 'lib/v1/interfaces/productsSet';
import { ProductsSetService } from 'lib/v1/services/productsSet';

import { OrderEnum, SuccessMessageResponse } from 'lib/v1/interfaces/public';

@Route('productsSet')
@Tags('ProductsSet')
// @Security('jwt', ['write', 'read'])
export class ProductsSetController extends Controller {
	/**
	 * Принимает id продукта, возвращает данные о нём.
	 * @param productId Идентификатор продукта
	 * @example productId 1
	 */
	@Get('{productSetId}')
	public async get(@Path() productSetId: string): Promise<IProductSetResponse> {
		return new ProductsSetService().get(productSetId);
	}

	/**
	 *Возвращает список продуктов.
	 */
	@Get()
	public async getAll(@Query() page?: number, @Query() owner?: string, @Query() sort?: ProductsSetSortEnum, @Query() order?: OrderEnum): Promise<IProductSetsResponse> {
		return new ProductsSetService().getAll(page, owner, sort, order);
	}

	/**
	 * Принимает id продукта, изменяет любые данные о нем
	 * @param productId Идентификатор продукта
	 * @example productId 1
	 */
	@Put('{productSetId}')
	public async update(@Path() productSetId: string, @Body() requestBody: IProductSetParams): Promise<IProductSetResponse> {
		return new ProductsSetService().update(productSetId, requestBody);
	}

	/**
	 *	Прикрепление катинки к существующему продукту(в теле запроса должен находится файл в multipart/form-data формате, в документации это не может отобразится)
	 * @param productId id заявки
	 * @example productId 4
	 */
	@Put('{productSetId}/images')
	public async addDocuments(@Path() productSetId: string, @Request() request: express.Request): Promise<SuccessMessageResponse> {
		return new ProductsSetService().addDocuments(productSetId, request);
	}

	/**
	 * Принимает id продукта, удаляет этот продукт
	 * @param productId Идентификатор продукта
	 * @example productId 1
	 */
	@Delete('{productSetId}')
	public async delete(@Path() productSetId: string): Promise<SuccessMessageResponse> {
		return new ProductsSetService().delete(productSetId);
	}

	/**
	 * Принимает возможные данные о продукте и создает его
	 * @param requestBody Возможные данные
	 */
	@Post()
	public async create(@Body() requestBody: IProductSetCreationParams): Promise<IProductSetResponse> {
		return new ProductsSetService().create(requestBody);
	}

}
