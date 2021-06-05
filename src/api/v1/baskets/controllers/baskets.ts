import express from 'express';
import { Body, Tags, Controller, Get, Path, Post, Put, Delete, Route, Query,Request, Example, Security } from 'tsoa';
import { IBasketResponse, IBasketUpdateRequest, IBasketParams, IBasketCreationParams, IBasketsResponse, BasketStatusEnum } from 'lib/v1/interfaces/baskets';
import { BasketsService } from 'lib/v1/services/baskets';

import { SuccessMessageResponse } from 'lib/v1/interfaces/public';

@Route('baskets')
@Tags('Baskets')
// @Security('jwt', ['write', 'read'])
export class BasketsController extends Controller {
	/**
	 * Принимает id пользователя, возвращает данные о нём.
	 * @param basketId Идентификатор корзины
	 * @example basketId "MP9b17Y04dq81aqKntmm"
	 */
	@Get('{basketId}')
	public async basketsGet(@Path() basketId: string,@Query() status?: BasketStatusEnum[]): Promise<IBasketsResponse> {
		return new BasketsService().get(basketId, status);
	}
	/**
	 *Возвращает список пользователей.
	 * @param page Номер страницы
	 * @example page 0
     * @param onPageLimit Количество записей на странице
	 * @example onPageLimit 50
	 * @param status Статус корзины(Можно указывает необходимые статусы через запятую)
	 * @example onPageLimit 50
	 */
	@Get()
	public async basketsGetAll(@Query() page: number = 0, @Query() onPageLimit: number = 50,@Query() status?: BasketStatusEnum[]): Promise<IBasketsResponse> {
		return new BasketsService().getAll(page, onPageLimit, status);
	}

	/**
	 * Разлчиные действия с корзиной
	 * @param userId Идентификатор пользователя
	 * @example userId "89816884969"
	 * @param requestBody Меняйте примеры для просмотра различных вариантов action:
	 *
	 *  Example 1: delete - Удаление одного товара из корзины пользователя, принимает индекс по которомоу товар находится в массиве
	 *
	 *  Example 2: add - Добавление одного товара в корзину, принимает id товара
	 *
	 * 	Example 3: update - Обновление количества конкретного продукта в корзине
	 *
	 * 	Example 4: incrementAmount - Увелечение количества конкретного продукта в корзине на 1
	 *
	 * 	Example 5: decrementAmount - Уменьшение количества конкретного продукта в корзине на 1
	 * 
	 * 	Example 6: updateStatus - Изменение статуса корзины(notPaid, paid, readyToIssue, issued)
	 * 
	 *
	 * @example requestBody  {
	 *   "action": "delete",
	 *   "position": 0
	 * }
	 *
	 * @example requestBody {
	 *   "action": "add",
	 *   "newItem": {
	 * 		"productId": 0,
	 * 		"amount": 2
	 * 	 }
	 * }
	 *
	 * @example requestBody {
	 * 	"action": "update",
	 * 	"position": 0,
	 *  "newAmount": 2
	 * }
	 * 	 @example requestBody {
	 * 	"action": "incrementAmount",
	 * 	"position": 0
	 * }
	 * 	  @example requestBody {
	 * 	"action": "decrementAmount",
	 * 	"position": 0
	 * }
	 *  @example requestBody {
	 * 	"action": "updateStatus",
	 * 	"newStatus": "paid"
	 * }
	 *
	 */
	@Put('{userId}/basket')
	public async basketsUpdate(@Path() userId: string,@Body() requestBody: IBasketUpdateRequest, @Query() sellerId: string ): Promise<IBasketResponse> {
		return new BasketsService().updateBasket(userId,  requestBody, sellerId);
	}

	/**
	 * Разлчиные действия с корзиной пополнения счёта
	 * @param basketId Идентификатор корзины
	 * @example basketId "MP9b17Y04dq81aqKntmm"
	 * @param requestBody Меняйте примеры для просмотра различных вариантов action:
	 *  Example 1: delete - Удаление одного товара из корзины пользователя, принимает индекс по которомоу товар находится в массиве
	 *
	 *  Example 2: add - Добавление одного товара в корзину, принимает id товара
	 *
	 * 	Example 3: update - Обновление количества конкретного продукта в корзине
	 *
	 * 	Example 4: incrementAmount - Увелечение количества конкретного продукта в корзине на 1
	 *
	 * 	Example 5: decrementAmount - Уменьшение количества конкретного продукта в корзине на 1
	 * 
	 * 	Example 6: updateStatus - Изменение статуса корзины(notPaid, paid, readyToIssue, issued)
	 * 
	 *
	 * @example requestBody  {
	 *   "action": "delete",
	 *   "position": 0
	 * }
	 *
	 * @example requestBody {
	 *   "action": "add",
	 *   "newItem": {
	 * 		"productId": 0,
	 * 		"amount": 2
	 * 	 }
	 * }
	 *
	 * @example requestBody {
	 * 	"action": "update",
	 * 	"position": 0,
	 *  "newAmount": 2
	 * }
	 * 	 @example requestBody {
	 * 	"action": "incrementAmount",
	 * 	"position": 0
	 * }
	 * 	  @example requestBody {
	 * 	"action": "decrementAmount",
	 * 	"position": 0
	 * }
	 *  @example requestBody {
	 * 	"action": "updateStatus",
	 * 	"newStatus": "paid"
	 * }
	 *
	 */
	 @Put('{basketId}/paymentBasket')
	 public async basketsUpdateByBasketId(@Path() basketId: string, @Body() requestBody: IBasketUpdateRequest): Promise<IBasketResponse> {
		 return new BasketsService().updateBasketByBasketId(basketId, requestBody);
	 }

	/**
	 * Принимает id пользователя, удаляет этого пользователя
	 * @param basketId Идентификатор корзины
	 * @example basketId "MP9b17Y04dq81aqKntmm"
	 */
	@Delete('{basketId}')
	public async basketsDelete(@Query() basketId?: string): Promise<SuccessMessageResponse> {
		return new BasketsService().delete(basketId);
	}

	/**
	 * Создаёт корзину пользователя
	 * @param requestBody Возможные данные, создавайте только с userId если нужна корзина пополнения счёта
	 */
	@Post()
	public async basketsCreate(@Body() requestBody: IBasketCreationParams): Promise<IBasketResponse | any> {
		console.log(requestBody)
		return new BasketsService().create(requestBody);
	}
}
