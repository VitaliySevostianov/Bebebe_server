import ProductSet from '../models/productsSet';

export async function validate(data: object) {
	const model = new ProductSet(data);
	await model.validate();
}

export const createProductSet = async (data: object) => {
	const product = new ProductSet(data);
	await product.save();
	return product;
};