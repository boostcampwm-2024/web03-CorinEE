import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import {
	DEFAULT_BTC,
	DEFAULT_KRW,
	DEFAULT_USDT,
	jwtConstants,
} from './constants';
import { v4 as uuidv4 } from 'uuid';
import { AccountRepository } from 'src/account/account.repository';
import { RedisRepository } from 'src/redis/redis.repository';
import { User } from './user.entity';
@Injectable()
export class AuthService {
	constructor(
		private userRepository: UserRepository,
		private accountRepository: AccountRepository,
		private jwtService: JwtService,
		private readonly redisRepository: RedisRepository,
	) {
		this.createAdminUser();
	}

	async signIn(username: string): Promise<{ access_token: string }> {
		const user = await this.userRepository.findOneBy({ username });
		const payload = { userId: user.id, userName: user.username };
		return {
			access_token: await this.jwtService.signAsync(payload, {
				secret: jwtConstants.secret,
				expiresIn: '6000s',
			}),
		};
	}

	async guestSignIn(): Promise<{ access_token: string }> {
		try{
			const username = `guest_${uuidv4()}`;

			await this.signUp(username, true);

			const guestUser = await this.userRepository.findOneBy({ username });

			await this.redisRepository.setAuthData(
				`guest:${guestUser.id}`,
				JSON.stringify({ userId: guestUser.id }),
				6000,
			);

			const payload = { userId: guestUser.id, userName: guestUser.username };
			return {
				access_token: await this.jwtService.signAsync(payload, {
					secret: jwtConstants.secret,
					expiresIn: '6000s',
				}),
			};
		}catch(error){
			console.error(error)
		}
	}

	async signUp(
		username: string,
		isGuest = false,
	): Promise<{ message: string }> {
		const existingUser = await this.userRepository.findOneBy({ username });
		if (existingUser) {
			throw new ConflictException('Username already exists');
		}

		const newUser = await this.userRepository.save({
			username,
			isGuest,
		});

		await this.accountRepository.save({
			user: newUser,
			KRW: DEFAULT_KRW,
			USDT: DEFAULT_USDT,
			BTC: DEFAULT_BTC,
		});

		return {
			message: isGuest
				? 'Guest user successfully registered'
				: 'User successfully registered',
		};
	}

	async logout(userId: number): Promise<{ message: string }> {
		const user = await this.userRepository.findOneBy({ id: userId });

		if (!user) {
			throw new Error('User not found');
		}

		if (user.isGuest) {
			await this.userRepository.delete({ id: userId });
			return { message: 'Guest user data successfully deleted' };
		}
	}

	async createAdminUser() {
		const user = await this.userRepository.findOneBy({ username: 'admin' });

		if (!user) {
			const adminUser = new User();
			adminUser.username = 'admin';
			await this.userRepository.save(adminUser);
			await this.accountRepository.createAccountForAdmin(adminUser);
			console.log('Admin user created successfully.');
		} else {
			console.log('Admin user already exists.');
		}
	}
}
