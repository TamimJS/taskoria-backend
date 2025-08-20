import jwt from 'jsonwebtoken';
import config from '@/config';

export interface TokenPayload {
	userId: string;
	email: string;
	role: string;
}

export interface GeneratedTokens {
	accessToken: string;
	refreshToken: string;
}

class JWTProvider {
	private accessSecret: string;
	private refreshSecret: string;
	private accessExpiresIn: string;
	private refreshExpiresIn: string;

	constructor() {
		this.accessSecret = config.JWT_ACCESS_SECRET;
		this.refreshSecret = config.JWT_REFRESH_SECRET;
		this.accessExpiresIn = config.JWT_ACCESS_EXPIRES_IN;
		this.refreshExpiresIn = config.JWT_REFRESH_EXPIRES_IN;

		if (!this.accessSecret || !this.refreshSecret) {
			throw new Error('JWT secrets must be provided');
		}
	}

	public generateTokens(payload: TokenPayload): GeneratedTokens {
		const accessToken = jwt.sign(payload, this.accessSecret, {
			expiresIn: this.accessExpiresIn
		});

		const refreshToken = jwt.sign(payload, this.refreshSecret, {
			expiresIn: this.refreshExpiresIn
		});

		return { accessToken, refreshToken };
	}

	public verifyAccessToken(token: string): TokenPayload {
		try {
			return jwt.verify(token, this.accessSecret) as TokenPayload;
		} catch (error) {
			throw new Error('Invalid or expired access token');
		}
	}

	public verifyRefreshToken(token: string): TokenPayload {
		try {
			return jwt.verify(token, this.refreshSecret) as TokenPayload;
		} catch (error) {
			throw new Error('Invalid or expired refresh token');
		}
	}

	public decodeToken(token: string): TokenPayload | null {
		try {
			return jwt.decode(token) as TokenPayload;
		} catch (error) {
			return null;
		}
	}
}

export default JWTProvider;
