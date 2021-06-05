import mongoose from 'mongoose';
import config from '../config';
import OAuthClient from '../oauth/models/oauth';

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

const writeNewOAuthUserToDB = async () => {
        try {
            const client = new OAuthClient({
                clientId: 'SomeUser',
                clientSecret: 'secret',
                availableScopes: ['write', 'read'],
            });
            console.log(client)
            client.save();
		} catch (e) {
			console.log(e);
		}
	
};

writeNewOAuthUserToDB()
	.then(() => {
		console.log('User was written in DB');
		mongoose.connection.close(true);
	})
	.catch((e) => console.log(e));
