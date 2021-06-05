import mongoose, { Schema, Document } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
autoIncrement.initialize(mongoose.connection);

export interface IProductSet extends Document {
	name: string;
	price: number;
	description: string;
	items: number[]
	images: Array<{
		size: number;
		mimeType: string;
		path: string;
		name: string;
	}>;
}

const ProductSetSchema: Schema = new Schema({
	name: String,
	price: Number,
	description: String,
	items: [Number],
	images: [
		{
			size: Number,
			mimeType: String,
			path: String,
			name: String,
		},
	],
});

ProductSetSchema.plugin(autoIncrement.plugin, { model: 'ProductSet', field: 'id' });

export default mongoose.model<IProductSet>('ProductSet', ProductSetSchema);
