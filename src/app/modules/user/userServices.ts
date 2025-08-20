import { PrismaClient } from '@/generated/prisma';
import {
	CreateUserDTO,
	UpdateUserDTO,
	UserQuery,
	UserRole,
	UserSelect,
	UserType,
	UserWhereClause
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
		query: UserQuery = {}
	): Promise<{ total: number; data: UserType[] }> {
		const { page = 1, limit = 10, search } = query;
		const skip = (page - 1) * limit;
		const where: UserWhereClause = {
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
				select: UserSelect,
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' }
			}),
			this.prisma.user.count({ where })
		]);

		return { total, data: users };
	}

	public async getUserById(id: string): Promise<UserType | null> {
		const user = await this.prisma.user.findFirst({
			where: { id },
			select: UserSelect
		});

		if (!user) {
			throw new NotFoundError('No users found with this id');
		}

		return user;
	}

	public async getUserByEmail(email: string): Promise<UserType | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
			select: UserSelect
		});

		return user;
	}

	public async createUser(userData: CreateUserDTO): Promise<UserType> {
		const { firstName, lastName, email, password, role, isActive } = userData;

		// Check if user exsist
		const existingUser = await this.getUserByEmail(email);
		if (existingUser) {
			throw new ConflictError('Unable to use this email address');
		}

		// Hash Password
		const hashedPassword = await this.passwordProvider.hash(password);

		// First User is Admin
		// const count = await this.countUsers();
		// const userRole: UserRole = count === 0 ? 'ADMIN' : role ?? 'MEMBER';

		// return this.prisma.user.create({
		// 	data: {
		// 		firstName,
		// 		lastName,
		// 		email,
		// 		password: hashedPassword,
		// 		role: userRole,
		// 		isActive: isActive ?? true
		// 	},
		// 	select: UserSelect
		// });

		// First User is Admin - using prisma transaction to avoid race conditions
		return this.prisma.$transaction(async (tx) => {
			const userCount = await tx.user.count();
			const userRole: UserRole = userCount === 0 ? 'ADMIN' : role ?? 'MEMBER';

			return tx.user.create({
				data: {
					firstName,
					lastName,
					email,
					password: hashedPassword,
					role: userRole,
					isActive: isActive ?? true
				},
				select: UserSelect
			});
		});
	}

	public async updateUser(
		id: string,
		userData: UpdateUserDTO
	): Promise<UserType> {
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
			select: UserSelect
		});

		return user;
	}

	public async deleteUser(id: string): Promise<void> {
		await this.getUserById(id);
		await this.prisma.user.delete({ where: { id } });
	}
}

export default UserServices;
