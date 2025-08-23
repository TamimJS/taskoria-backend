import Server from '@/server';
import prisma from '@/database';
import { AppProivders } from './types';
import PasswordProvider from './app/core/providers/passwordProvider';
import JWTProvider from './app/core/providers/jwtProvider';

class App {
	private server: Server;
	private providers: AppProivders = {} as AppProivders;

	constructor() {
		this.providers.passwordProvider = new PasswordProvider();
		this.providers.jwtProvider = new JWTProvider();
		this.server = new Server({
			prisma,
			passwordProvider: this.providers.passwordProvider,
			jwtProvider: this.providers.jwtProvider
		});
	}

	public run(): void {
		this.server.start();
	}
}

const Taskoria: App = new App();
Taskoria.run();
