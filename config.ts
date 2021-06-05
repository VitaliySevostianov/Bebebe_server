const config = {
	production: {
		mongo: {
			mongoString: process.env.MONGO_STRING || 'mongodb://localhost:27047/marketplace',
		},
		server: {
			serverPort: process.env.PORT || 4000,
		},
	},
};

export default config.production;
