import JWT, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '@/config';

export interface TokenPayload extends JwtPayload {
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

	public async generateTokens(payload: TokenPayload): Promise<GeneratedTokens> {
		const accessToken = JWT.sign(payload, this.accessSecret, {
			expiresIn: this.accessExpiresIn as JWT.SignOptions['expiresIn']
		});

		const refreshToken = JWT.sign(payload, this.refreshSecret, {
			expiresIn: this.refreshExpiresIn as JWT.SignOptions['expiresIn']
		});

		return { accessToken, refreshToken };
	}

	public verifyAccessToken(token: string): TokenPayload {
		try {
			return JWT.verify(token, this.accessSecret) as TokenPayload;
		} catch (error) {
			throw new Error('Invalid or expired access token');
		}
	}

	public verifyRefreshToken(token: string): TokenPayload {
		try {
			return JWT.verify(token, this.refreshSecret) as TokenPayload;
		} catch (error) {
			throw new Error('Invalid or expired refresh token');
		}
	}

	public async decodeToken(token: string): Promise<TokenPayload | null> {
		try {
			return JWT.decode(token) as TokenPayload;
		} catch (error) {
			return null;
		}
	}
}

export default JWTProvider;
