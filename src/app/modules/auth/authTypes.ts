import { TAuthUserWithoutPassword, TUserRole } from '../user/userTypes';
import { PrismaClient } from '@/generated/prisma';
import { Router } from 'express';
import AuthServices from './authServices';
import AuthController from './authController';
import PasswordProvider from '@/app/core/providers/passwordProvider';
import JWTProvider from '@/app/core/providers/jwtProvider';

// DTOs
export type TRegisterDTO = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type TloginDTO = {
	email: string;
	password: string;
};

export type TRefreshTokenDTO = {
	refreshToken: string;
};

export type TAuthResponse = {
	user: TAuthUserWithoutPassword;
	accessToken: string;
	refreshToken: string;
};

// TokenPayload
export type TTokenPayload = {
	userId: string;
	email: string;
	role: TUserRole;
};

// Module Types
export type TAuthModuleDeps = {
	prisma: PrismaClient;
	passwordProvider: PasswordProvider;
	jwtProvider: JWTProvider;
};

export type TAuthModule = {
	routes: Router;
	services: AuthServices;
	controller: AuthController;
};
