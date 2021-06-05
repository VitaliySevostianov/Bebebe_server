import mongoose, { Schema, Document } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
autoIncrement.initialize(mongoose.connection);

export interface IOrder extends Document {
	phone: string,
	name: string,
	basketId: string,
}

const OrderSchema: Schema = new Schema({
	phone: String,
	name: String,
	basketId: String,
});

OrderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'id' });

export default mongoose.model<IOrder>('Order', OrderSchema);
