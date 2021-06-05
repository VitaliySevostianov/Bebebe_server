import path from 'path';
import fs from 'fs';

import readXlsxFile from 'read-excel-file/node';
import { createProduct, validate } from 'lib/v1/helpers/products';
import mongoose from 'mongoose';
import config from '../config';
console.log(config.mongo.mongoString);
mongoose
	.connect(config.mongo.mongoString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.catch((e) => {
		throw e;
	});

const readTable = async (startRow, filename) => {
	const file = path.join(__dirname, `../scripts/Excel/${filename}.xlsx`);
	const results = await readXlsxFile(file);
	for (let i = startRow; i < results.length; i++) {
        const item = results[i];
        console.log(item)
		const newItem = {
            description: item[0],
            price: item[1],
            userId: item[2]
        };
        await validate(newItem);
        await createProduct(newItem);
	}
};

console.log('Excel filename', process.env.FILENAME)
readTable(1, process.env.FILENAME || 'Products').then(() => {
		mongoose.connection.close(true);
})