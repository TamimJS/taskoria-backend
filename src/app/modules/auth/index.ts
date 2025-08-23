import { TAuthModule, TAuthModuleDeps } from './authTypes';
import AuthServices from './authServices';
import AuthController from './authController';
import CreateAuthRoutes from './authRoutes';

const CreateAuthModule = (deps: TAuthModuleDeps): TAuthModule => {
	const services = new AuthServices(
		deps.prisma,
		deps.passwordProvider,
		deps.jwtProvider
	);
	const controller = new AuthController(services);
	const routes = CreateAuthRoutes(controller);

	return { services, controller, routes };
};

export default CreateAuthModule;
