const CreateUserModule = (deps: UserModuleDeps): UserModule => {
	return { services, controller, routes };
};

export default CreateUserModule;
