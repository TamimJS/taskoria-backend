import { UserModule } from '@/app/modules/user/userTypes';
import { PrismaClient } from '@/generated/prisma';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export type AsyncHandler<
	Req extends Request = Request,
	Res extends Response = Response
> = (req: Req, res: Res, next: NextFunction) => Promise<unknown>;

export type AsyncHandlerWrapper = (
	fn: AsyncHandler<Req, Res>
) => RequestHandler;

export type ServerDeps = {
	prisma: PrismaClient;
};

export type Modules = {
	user: UserModule;
};

export type ErrorJSON = {
	status: number; // HTTP status
	code: string; // short machine code (e.g. VALIDATION_ERROR, EMAIL_TAKEN)
	message: string; // friendly (safe) text for users/toasts
	fieldErrors?: Record<string, string[]>; // inline field errors for forms
	meta?: Record<string, unknown>; // optional, safe extra data (never secrets)
};
