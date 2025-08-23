import { Prisma, PrismaClient, $Enums } from '@/generated/prisma';
import { Router } from 'express';
import UserServices from './userServices';
import UserController from './userController';
import PasswordProvider from '@/app/core/providers/passwordProvider';

// Module Types
export type TUserModuleDeps = {
	prisma: PrismaClient;
	passwordProvider: PasswordProvider;
};

export type TUserModule = {
	routes: Router;
	services: UserServices;
	controller: UserController;
};

export type TUserRole = $Enums.UserRole;

export const UserWithoutPasswordSelect: Prisma.UserSelect = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
	password: false,
	role: true,
	isActive: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.UserSelect;

export const UserWithPasswordSelect: Prisma.UserSelect = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
	password: true,
	role: true,
	isActive: true,
	createdAt: true,
	updatedAt: true
} satisfies Prisma.UserSelect;

export type TUserWithoutPassword = Prisma.UserGetPayload<{
	select: typeof UserWithoutPasswordSelect;
}>;

export type TUserWithPassword = Prisma.UserGetPayload<{
	select: typeof UserWithPasswordSelect;
	include: { refreshTokens: true };
}>;

export type TAuthUserWithPassword = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: TUserRole;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	refreshTokens: Array<{
		id: string;
		createdAt: Date;
		token: string;
		revoked: boolean;
		expiresAt: Date;
		userId: string;
	}>;
} | null;

export type TAuthUserWithoutPassword = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: TUserRole;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	refreshTokens: Array<{
		id: string;
		createdAt: Date;
		token: string;
		revoked: boolean;
		expiresAt: Date;
		userId: string;
	}>;
};

// export type UserType = Prisma.UserGetPayload<{
// 	select: {
// 		id: true;
// 		firstName: true;
// 		lastName: true;
// 		email: true;
// 		role: true;
// 		isActive: true;
// 		createdAt: true;
// 		updatedAt: true;
// 	};
// }>;

// User Select shape for Prisma select
// export const UserSelect = {
// 	id: true,
// 	firstName: true,
// 	lastName: true,
// 	email: true,
// 	role: true,
// 	isActive: true,
// 	createdAt: true,
// 	updatedAt: true
// } as const;

// For the where search clause
export type TUserWhereClause = Prisma.UserWhereInput;

// Payloads (DTOs = Data Transfer Objects) - coming into the service/controller
export type TUserCreateDTO = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role?: TUserRole;
	isActive?: boolean;
};

export type TUserUpdateDTO = {
	firstName: string;
	lastName: string;
	role?: TUserRole;
	isActive?: boolean;
};

// Query params
export type TUserQuery = {
	page?: number;
	limit?: number;
	search?: string;
};
