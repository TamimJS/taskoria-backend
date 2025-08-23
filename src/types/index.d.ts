import JWTProvider from '@/app/core/providers/jwtProvider';
import PasswordProvider from '@/app/core/providers/passwordProvider';
import { AuthModule } from '@/app/modules/auth/authTypes';
import { UserModule } from '@/app/modules/user/userTypes';
import { PrismaClient } from '@/generated/prisma';
import {
	Express,
	Request,
	Response,
	NextFunction,
	RequestHandler
} from 'express';

declare global {
	namespace Express {
		interface Request {
			validated?: Partial<Record<'body' | 'query' | 'params', unknown>>;
		}
	}
}

export type AsyncHandler<
	Req extends Request = Request,
	Res extends Response = Response
> = (req: Req, res: Res, next: NextFunction) => Promise<unknown>;

export type AsyncHandlerWrapper = (
	fn: AsyncHandler<Req, Res>
) => RequestHandler;

export type ServerDeps = {
	prisma: PrismaClient;
	passwordProvider: PasswordProvider;
	jwtProvider: JWTProvider;
};

export type AppProivders = {
	passwordProvider: PasswordProvider;
	jwtProvider: JWTProvider;
};

export type Modules = {
	user: UserModule;
	auth: AuthModule;
};

export type ErrorJSON = {
	status: number; // HTTP status
	code: string; // short machine code (e.g. VALIDATION_ERROR, EMAIL_TAKEN)
	message: string; // friendly (safe) text for users/toasts
	fieldErrors?: Record<string, string[]>; // inline field errors for forms
	meta?: Record<string, unknown>; // optional, safe extra data (never secrets)
};
