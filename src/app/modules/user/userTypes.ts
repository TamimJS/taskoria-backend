import { Prisma, PrismaClient, $Enums } from '@/generated/prisma';
import { Router } from 'express';
import UserServices from './userServices';
import UserController from './userController';

export type UserModuleDeps = {
	prisma: PrismaClient;
};

export type UserModule = {
	routes: Router;
	services: UserServices;
	controller: UserController;
};

export type UserRole = $Enums.UserRole;

export type UserType = Prisma.UserGetPayload<{
	select: {
		id: true;
		firstName: true;
		lastName: true;
		email: true;
		role: true;
		isActive: true;
		createdAt: true;
		updatedAt: true;
	};
}>;

// User Select shape for Prisma select
export const UserSelect = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
	role: true,
	isActive: true,
	createdAt: true,
	updatedAt: true
} as const;

// Payloads (DTOs = Data Transfer Objects) - coming into the service/controller
export type CreateUserDTO = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role?: UserRole;
	isActive?: boolean;
};

export type UpdateUserDTO = {
	firstName: string;
	lastName: string;
	role?: UserRole;
	isActive?: boolean;
};

// Query params
export type UserQuery = {
	page?: number;
	limit?: number;
	search?: string;
};
