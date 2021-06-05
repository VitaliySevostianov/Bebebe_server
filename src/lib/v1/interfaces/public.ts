/**
 * Ответ сервера содержащий флаг успешности операции и сообщение
 */
export interface SuccessMessageResponse {
	/**
	 * Флаг успешности операции
	 * @example true
	 */
	success: boolean;
	/**
	 * Сообщение
	 * @example "Запрос был выполнен"
	 */
	message?: string;
}

export type OrderEnum = 'default' | 'reverse'
