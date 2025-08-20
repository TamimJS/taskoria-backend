import Server from '@/server';
import prisma from '@/database';

class App {
	private server: Server;

	constructor() {
		this.server = new Server({ prisma });
	}

	public run(): void {
		this.server.start();
	}
}

const Taskoria: App = new App();
Taskoria.run();
