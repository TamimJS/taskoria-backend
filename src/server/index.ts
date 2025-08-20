import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import config from '@/config';
import logger from '@/utils/logger';
import { Modules, ServerDeps } from '@/types';
import CreateUserModule from '@/app/modules/user';
import AppRouter from '@/app/core/router';
import notFound from '@/app/core/middlewares/notFound';
import { errorHandler } from '@/app/core/middlewares/errorHandler';

class Server {
	private app: Application;
	private port: number;
	private deps: ServerDeps;
	private modules: Modules;

	constructor(deps: ServerDeps) {
		this.app = express();
		this.port = config.PORT;
		this.deps = deps;
		this.modules = {} as Modules;
	}

	private listen(): void {
		this.app.listen(this.port, () => {
			logger.info(`Server is up & running @ http://localhost:${this.port}`);
		});
	}

	private initializeMiddlewares(): void {
		this.app.use(helmet());
		this.app.use(
			cors({
				origin: config.CORS_ORIGIN ?? true,
				credentials: true
			})
		);
		// this.app.use(pinoHttp({ logger }));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private mountModules(): void {
		this.modules.user = CreateUserModule({ prisma: this.deps.prisma });
	}

	private initializeRoutes(): void {
		this.app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
			return res
				.status(200)
				.json({ status: 'OK', message: 'Welcome to the App' });
		});
		this.app.get(
			'/health',
			(_req: Request, res: Response, _next: NextFunction) => {
				return res.status(200).json({ status: 'OK' });
			}
		);

		//Routes
		AppRouter(this.app, this.modules);
	}

	private initializeErrorHandler(): void {
		this.app.use(notFound);
		this.app.use(errorHandler());
	}

	public start(): void {
		this.initializeMiddlewares();
		this.mountModules();
		this.initializeRoutes();
		this.initializeErrorHandler();
		this.listen();
	}
}

export default Server;
