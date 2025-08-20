import argon2, { Options } from 'argon2';

class PasswordProvider {
	private hashOptions: Options = {
		type: argon2.argon2id,
		timeCost: 4,
		memoryCost: 65536,
		parallelism: 4,
		hashLength: 32
	};

	public async hash(password: string): Promise<string> {
		return argon2.hash(password, this.hashOptions);
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return argon2.verify(hash, password);
	}
}

export default PasswordProvider;
