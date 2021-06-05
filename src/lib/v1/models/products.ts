import mongoose, { Schema, Document } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
autoIncrement.initialize(mongoose.connection);

export interface IProduct extends Document {
	name: string;
	price: number;
	description: string;
	images: Array<{
		size: number;
		mimeType: string;
		path: string;
		name: string;
	}>;
}

const ProductSchema: Schema = new Schema({
	name: String,
	price: Number,
	description: String,
	images: [
		{
			size: Number,
			mimeType: String,
			path: String,
			name: String,
		},
	],
});

ProductSchema.plugin(autoIncrement.plugin, { model: 'Product', field: 'id' });

export default mongoose.model<IProduct>('Product', ProductSchema);
