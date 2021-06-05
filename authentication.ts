import express from 'express';
import jwt from 'jsonwebtoken';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
	if (securityName === 'api_token') {
		let token = request.body.token || request.query.token || request.headers['x-access-token'];

		if (token === 'token1') {
			console.log('CONGRATS');
			return Promise.resolve({
				id: 1,
				name: 'Vitaliy',
			});
		} else {
			return Promise.reject({});
		}
	}

	if (securityName === 'jwt') {
		const token = request.body.token || request.query.token || request.headers['authorization'] || request.headers['x-access-token'];
		console.log(request.headers);
		console.log(token);
		return new Promise((resolve, reject) => {
			if (!token) {
				reject(new Error('No token provided'));
			}
			jwt.verify(token, 'secret', function (err: any, decoded: any) {
				if (err) {
					reject(err);
				} else {
					console.log(decoded);
					// Check if JWT contains all required scopes
					for (let scope of scopes) {
						if (!decoded.scopes.includes(scope)) {
							reject(new Error('JWT does not contain required scope.'));
						}
					}
					if (Math.floor(new Date().getTime() / 1000) < decoded.exp) {
						resolve(decoded);
					} else {
						reject(new Error('Token was expired'));
					}
				}
			});
		});
	}
}
