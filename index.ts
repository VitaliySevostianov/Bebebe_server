import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet'; //Защита от HTTP заголовков
import cors from 'cors'; //Подключение CORS
import passport from 'passport';

import autoIncrement from 'mongoose-auto-increment';

import fileUpload from 'express-fileupload';
import morgan from 'morgan';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './src/outputs/tsoa/swagger.json';

import config from './config';

import { RegisterRoutes } from './src/outputs/tsoa/routes';

const app = express();

import multer from 'multer'
const upload = multer({})
app.use(
	upload.fields([{ name: 'files' },{ name: 'showcase' },{ name: 'signboard' },{name: 'excel'}])
)

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
	done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
	done(null, user);
});
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

autoIncrement.initialize(mongoose.connection);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50000kb' }));

RegisterRoutes(app);
console.log('swaggerDocument', swaggerDocument)
console.log('swaggerUi', swaggerUi)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

import swagger from './src/outputs/tsoa/swagger.json';
app.use('/swagger.json', (req, res) => {
	res.send(swagger);
});

import { ValidateError } from 'tsoa';
app.use(function errorHandler(err: unknown, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {
	if (err instanceof ValidateError) {
		console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
		return res.status(422).json({
			message: 'Validation Failed',
			details: err.fields,
		});
	}
	if (err instanceof Error) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error',
			error: err.message,
			stack: err.stack
		});
	}

	next();
});

import path from 'path';
app.use('/images', express.static(path.join(__dirname, 'src', 'outputs', 'documents')));


app.use(function (req, res) {
	res.status(404).send({ error: { name: 'Error', message: 'Unused request. Check request method' } });
});

app.listen(config.server.serverPort, () => {
	console.log(`Документация - http://127.0.0.1:${config.server.serverPort}/api-docs`);
	console.log(`Server now listening for requests on port ${config.server.serverPort}`);
});
