import {
	ConflictException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import {
	ACCESS_TOKEN_TTL,
	DEFAULT_BTC,
	DEFAULT_KRW,
	DEFAULT_USDT,
	GUEST_ID_TTL,
	REFRESH_TOKEN_TTL,
	jwtConstants,
} from './constants';
import { v4 as uuidv4 } from 'uuid';
import { AccountRepository } from 'src/account/account.repository';
import { RedisRepository } from 'src/redis/redis.repository';
import { User } from './user.entity';
import { SignUpDto } from './dtos/sign-up.dto';
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

	async signIn(
		username: string,
	): Promise<{ access_token: string; refresh_token: string }> {
		const user = await this.userRepository.findOneBy({ username });
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return this.generateTokens(user.id, user.username);
	}

	async guestSignIn(): Promise<{
		access_token: string;
		refresh_token: string;
	}> {
		const guestName = `guest_${uuidv4()}`;
		const user = { name: guestName, isGuest: true };

		await this.signUp(user);

		const guestUser = await this.userRepository.findOneBy({
			username: guestName,
		});
		if (!guestUser) {
			throw new UnauthorizedException('Guest user creation failed');
		}
		return this.generateTokens(guestUser.id, guestUser.username);
	}

	async signUp(user: {
		name: string;
		email?: string;
		provider?: string;
		providerId?: string;
		isGuest?: boolean;
	}): Promise<{ message: string }> {
		const { name, email, provider, providerId, isGuest } = user;

		const existingUser = isGuest
			? await this.userRepository.findOneBy({ username: name })
			: await this.userRepository.findOne({
					where: { provider, providerId },
				});

		if (existingUser) {
			throw new ConflictException('User already exists');
		}

		const newUser = await this.userRepository.save({
			username: name,
			email,
			provider,
			providerId,
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

	async validateOAuthLogin(
		signUpDto: SignUpDto,
	): Promise<{ access_token: string; refresh_token: string }> {
		const { name, email, provider, providerId, isGuest } = signUpDto;

		let user = await this.userRepository.findOne({
			where: { provider, providerId },
		});

		if (!user) {
			await this.signUp(
				{ name, email, provider, providerId, isGuest: false },
			);
			user = await this.userRepository.findOne({
				where: { provider, providerId },
			});
		}

		if (!user) {
			throw new UnauthorizedException('OAuth user creation failed');
		}

		return this.generateTokens(user.id, user.username);
	}

	private async generateTokens(
		userId: number,
		username: string,
	): Promise<{ access_token: string; refresh_token: string }> {
		const payload = { userId, userName: username };

		const accessToken = await this.jwtService.signAsync(payload, {
			secret: jwtConstants.secret,
			expiresIn: ACCESS_TOKEN_TTL,
		});

		const refreshToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: jwtConstants.refreshSecret,
				expiresIn: REFRESH_TOKEN_TTL,
			},
		);

		await this.redisRepository.setAuthData(
			`refresh:${userId}`,
			refreshToken,
			REFRESH_TOKEN_TTL,
		);

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}

	async refreshTokens(
		refreshToken: string,
	): Promise<{ access_token: string; refresh_token: string }> {
		try {
			const payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: jwtConstants.refreshSecret,
			});
			const userId = payload.userId;

			const storedToken = await this.redisRepository.getAuthData(
				`refresh:${userId}`,
			);

			if (!storedToken) {
				throw new ForbiddenException({
					message: 'Refresh token has expired',
					errorCode: 'REFRESH_TOKEN_EXPIRED',
				});
			}

			if (storedToken !== refreshToken) {
				throw new UnauthorizedException({
					message: 'Invalid refresh token',
					errorCode: 'INVALID_REFRESH_TOKEN',
				});
			}

			const user = await this.userRepository.findOneBy({ id: userId });
			if (!user) {
				throw new UnauthorizedException('User not found');
			}
			return this.generateTokens(user.id, user.username);
		} catch (error) {
			throw new UnauthorizedException({
				message: 'Failed to refresh tokens',
				errorCode: 'TOKEN_REFRESH_FAILED',
			});
		}
	}

	async logout(userId: number): Promise<{ message: string }> {
		try {
			const user = await this.userRepository.findOneBy({ id: userId });

			if (!user) {
				throw new Error('User not found');
			}

			await this.redisRepository.deleteAuthData(`refresh:${userId}`);

			if (user.isGuest) {
				await this.userRepository.delete({ id: userId });
				return { message: 'Guest user data successfully deleted' };
			}
		} catch (error) {
			console.error(error);
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
