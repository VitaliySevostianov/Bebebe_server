import Order from '../models/orders';

export async function validate(data: object) {
	const model = new Order(data);
	await model.validate();
}

export const createOrder = async (data: object) => {
	const order = new Order(data);
	await order.save();
	return order;
};