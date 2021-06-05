import Product from '../models/products';

export async function validate(data: object) {
	const model = new Product(data);
	await model.validate();
}

export const createProduct = async (data: object) => {
	const product = new Product(data);
	await product.save();
	return product;
};