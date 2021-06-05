import mongoose, { Schema, Document } from 'mongoose';
import { BasketStatusEnum } from '../interfaces/baskets';

export interface IBasket{
    items?: Array<{
        productId?: number;
        productType?: string;

        amount?: number;
        price?: number
    }>;
    status: BasketStatusEnum;
    totalPrice?: number;
    timestamp: Date
}

const BasketSchema: Schema = new Schema({
    basketId: String,
    items: [{
        productId: Number,
        productType: String,
        amount: {type: Number, min: 1},
        price: Number
    }],
    status: String,
    totalPrice: Number,
    timestamp: Date
}, { versionKey: false });

export const Basket = mongoose.model('Basket', BasketSchema, 'baskets');


