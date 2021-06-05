import { IBasket } from '../models/baskets';
/*
 * Поля пользователя
 */
export interface IBasketParams {
        /**
     * Товары в корзине
     */
    items?: IBasket['items'];
        /**
     * Итоговая цена
     */
    totalPrice?: IBasket['totalPrice'];
    /**
    * Статус корзины
    * @example	"notPaid"
    */
    status: IBasket['status']
}

export interface IBasketCreationParams {

}

/**
* Ответ сервера содержащий флаг успешности операции и данные о пользователе
*/
export interface IBasketResponse {
/**
 * Флаг успешности операции
 * @example true
 */
success: true | false;
/**
 * Кол-во доступных страниц с учётом текущего лимита вывода на странице
 */
pagesAmount?: number;
/**
 * Обьект описывающий пользователя
 */
basket?: {
    /**
     * Товары в корзине
     */
    items?: Array<{
        /**
         * id товара
         */
        productId?: number;
        productType?: string;
        /**
         * Количетство товаров
         */
        amount?: number;
        /**
         * Цена товара
         */
        price?: number; 
    }>;
    /**
     * Итоговая цена
     */
    totalPrice?: number;
    /**
     * Время создания корзины
     */
    timestamp: IBasket['timestamp']
    /**
    * Статус корзины
    * @example	"notPaid"
    */
     status: IBasket['status']
};
}

export interface IBasketsResponse {
    /**
     * Флаг успешности операции
     * @example true
     */
    success: true | false;
    /**
     * Кол-во доступных страниц с учётом текущего лимита вывода на странице
     */
    pagesAmount?: number;
    /**
     * Обьект описывающий пользователя
     */
    baskets?: {
        /**
         * Товары в корзине
         */
        items?: Array<{
            /**
             * id товара
             */
            productId?: number;
            productType?: string;
            /**
             * Количетство товаров
             */
            amount?: number;
            /**
             * Цена товара
             */
            price?: number; 
        }>;
        /**
         * Итоговая цена
         */
        totalPrice?: number;
         /**
         * Время создания корзины
         */
        timestamp: IBasket['timestamp']
        /**
        * Статус корзины
        * @example	"notPaid"
        */
        status: IBasket['status']
    }[];
    }

export interface IBasketUpdateRequest {
    /**
     * Позиция товара внутри корзины
     */
    position?: number;
    /**
     * Описание нового товара добавляемого в корзину
     */
    newItem?: {
        /**
         * id товара
         */
        productId: number;
        productType?: string;
        /**
         * Количетство товаров
         */
        amount: number;
        /**
         * Цена товара
         */
        price?: number; 
    };

    newPayment?: {
        /**
         * Цена товара
         */
        price?: number; 
    };
    /**
     * Новое количество товара
     */
    newAmount?: number;
    /**
    * Выбранное действие с корзиной
    */
    action: string;
    /**
    * Статус корзины
    * @example	"notPaid"
    */
    newStatus?: IBasket['status']
}

export type BasketStatusEnum = 'notPaid' | 'paid' | 'readyToIssue' | 'issued' | ""

