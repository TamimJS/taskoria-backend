import { PrismaClient } from '@/generated/prisma';
import {
	TUserCreateDTO,
	TUserQuery,
	TUserUpdateDTO,
	TUserWhereClause,
	TUserWithoutPassword,
	UserWithoutPasswordSelect
} from './userTypes';
import PasswordProvider from '@/app/core/providers/passwordProvider';
import { ConflictError, NotFoundError } from '@/app/core/errors';

class UserServices {
	constructor(
		private prisma: PrismaClient,
		private passwordProvider: PasswordProvider
	) {}

	public async countUsers(): Promise<number> {
		return this.prisma.user.count();
	}

	public async getUsers(
		query: TUserQuery = {}
	): Promise<{ total: number; data: TUserWithoutPassword[] }> {
		const { page = 1, limit = 10, search } = query;
		const skip = (page - 1) * limit;
		const where: TUserWhereClause = {
			isActive: true // only fetch active users by default
		};

		// Search
		if (search) {
			where.OR = [
				{ firstName: { contains: search, mode: 'insensitive' } },
				{ lastName: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } }
			];
		}

		const [users, total] = await Promise.all([
			this.prisma.user.findMany({
				where,
				select: UserWithoutPasswordSelect,
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' }
			}),
			this.prisma.user.count({ where })
		]);

		return { total, data: users };
	}

	public async getUserById(id: string): Promise<TUserWithoutPassword | null> {
		const user = await this.prisma.user.findFirst({
			where: { id },
			select: UserWithoutPasswordSelect
		});

		if (!user) {
			throw new NotFoundError('No users found with this id');
		}

		return user;
	}

	public async getUserByEmail(
		email: string
	): Promise<TUserWithoutPassword | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: UserWithoutPasswordSelect
		});

		return user;
	}

	public async createUser(
		userData: TUserCreateDTO
	): Promise<TUserWithoutPassword> {
		const { firstName, lastName, email, password, role, isActive } = userData;

		// Check if user exsist
		const existingUser = await this.getUserByEmail(email);
		if (existingUser) {
			throw new ConflictError('Unable to use this email address');
		}

		// Hash Password
		const hashedPassword = await this.passwordProvider.hash(password);

		return this.prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: hashedPassword,
				role: role ?? 'MEMBER',
				isActive: isActive ?? true
			},
			select: UserWithoutPasswordSelect
		});
	}

	public async updateUser(
		id: string,
		userData: TUserUpdateDTO
	): Promise<TUserWithoutPassword> {
		// check existence first
		await this.getUserById(id);

		const { firstName, lastName, role, isActive } = userData;

		const user = await this.prisma.user.update({
			where: { id },
			data: {
				firstName,
				lastName,
				role,
				isActive
			},
			select: UserWithoutPasswordSelect
		});

		return user;
	}

	public async deleteUser(id: string): Promise<void> {
		await this.getUserById(id);
		await this.prisma.user.delete({ where: { id } });
	}
}

export default UserServices;
