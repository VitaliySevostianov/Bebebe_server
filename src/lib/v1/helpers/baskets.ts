import {Basket} from '../models/baskets';

export async function validate(data: object) {
	const model = new Basket(data);
	await model.validate();
}

export const createBasket = async (data: object) => {
	const basket = new Basket(data);
	await basket.save();
	return basket;
};