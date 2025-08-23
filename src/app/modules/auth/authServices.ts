import { PrismaClient } from '@/generated/prisma';
import {
	TAuthUserWithPassword,
	TAuthUserWithoutPassword,
	TUserRole,
	UserWithoutPasswordSelect
} from '../user/userTypes';
import PasswordProvider from '@/app/core/providers/passwordProvider';
import JWTProvider from '@/app/core/providers/jwtProvider';
import {
	TAuthResponse,
	TloginDTO,
	TTokenPayload,
	TRegisterDTO
} from './authTypes';
import { ConflictError, UnauthorizedError } from '@/app/core/errors';

class AuthServices {
	constructor(
		private prisma: PrismaClient,
		private passwordProvider: PasswordProvider,
		private jwtProvider: JWTProvider
	) {}

	private async generateUserTokens(user: TAuthUserWithoutPassword): Promise<{
		accessToken: string;
		refreshToken: string;
	}> {
		const payload: TTokenPayload = {
			userId: user.id,
			email: user.email,
			role: user.role
		};

		return await this.jwtProvider.generateTokens(payload);
	}

	private async storeRefreshTokens(
		userId: string,
		refreshToken: string
	): Promise<void> {
		const decoded = await this.jwtProvider.decodeToken(refreshToken);
		if (decoded === null) {
			throw new Error('Invalid refresh token');
		}

		await this.prisma.refreshToken.create({
			data: {
				userId,
				token: refreshToken,
				expiresAt: new Date(decoded.exp! * 1000) // JWT exp is in seconds - 1w
			}
		});
	}

	// REGISTER
	public async register(registerData: TRegisterDTO): Promise<TAuthResponse> {
		// get the registerData from controller
		const { firstName, lastName, email, password } = registerData;

		// check if user exsists - throw conflict error
		const existingUser = await this.prisma.user.findUnique({
			where: { email }
		});
		if (existingUser) {
			throw new ConflictError('Please chose another email address');
		}

		// hash password
		const hashedPassword = await this.passwordProvider.hash(password);

		// create user - first user is admin
		const user = await this.prisma.$transaction(async (tx) => {
			const userCount = await this.prisma.user.count();
			const userRole: TUserRole = userCount === 0 ? 'ADMIN' : 'MEMBER';

			return tx.user.create({
				data: {
					firstName,
					lastName,
					email,
					password: hashedPassword,
					role: userRole,
					isActive: true
				},
				select: UserWithoutPasswordSelect
			});
		});

		// generate token
		const tokens = await this.generateUserTokens(user);

		// store refresh token
		await this.storeRefreshTokens(user.id, tokens.refreshToken);

		// return response with {user, accessToken, refreshToken}
		return {
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken
		};
	}

	// LOGIN
	public async login(loginData: TloginDTO): Promise<TAuthResponse> {
		// get the loginData from controller
		const { email, password } = loginData;

		// Find user with password included
		const userWithPassword: TAuthUserWithPassword =
			await this.prisma.user.findUnique({
				where: { email },
				include: { refreshTokens: true }
			});

		if (!userWithPassword || !userWithPassword.isActive) {
			throw new UnauthorizedError('Invalid credentials - email');
		}

		// Verify Password
		const isValidPassword = await this.passwordProvider.verify(
			userWithPassword.password,
			password
		);

		if (!isValidPassword) {
			throw new UnauthorizedError('Invalid credentials - password');
		}

		const user: TAuthUserWithoutPassword = {
			id: userWithPassword.id,
			firstName: userWithPassword.firstName,
			lastName: userWithPassword.lastName,
			email: userWithPassword.email,
			role: userWithPassword.role,
			isActive: userWithPassword.isActive,
			createdAt: userWithPassword.createdAt,
			updatedAt: userWithPassword.updatedAt,
			refreshTokens: userWithPassword.refreshTokens
		};

		// Generate Tokens
		const tokens = await this.generateUserTokens(user);

		// Store refresh token
		await this.storeRefreshTokens(user.id, tokens.refreshToken);

		return {
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken
		};
	}
}

export default AuthServices;
