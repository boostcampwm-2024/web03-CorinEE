import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
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
import { AuthRedisRepository } from 'src/redis/auth-redis.repository';
import { User } from './user.entity';
import { SignUpDto } from './dtos/sign-up.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

	constructor(
		private userRepository: UserRepository,
		private accountRepository: AccountRepository,
		private jwtService: JwtService,
		private readonly redisRepository: AuthRedisRepository,
	) {}

  async signIn(
    username: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.findUserByUsername(username);
    return this.generateTokens(user.id, user.username);
  }

  async guestSignIn(): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const guestName = `guest_${uuidv4()}`;
    await this.registerGuestUser(guestName);

    const guestUser = await this.findUserByUsername(guestName);
    await this.cacheGuestUser(guestUser.id);

    return this.generateTokens(guestUser.id, guestUser.username);
  }

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { name, provider, providerId, isGuest } = signUpDto;

    await this.checkUserConflict(name, provider, providerId, isGuest);

    const newUser = await this.createUser(signUpDto);
    await this.initializeAccountForUser(newUser);

    return {
      message: isGuest
        ? 'Guest user successfully registered'
        : 'User successfully registered',
    };
  }

  async validateOAuthLogin(
    signUpDto: SignUpDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { provider, providerId } = signUpDto;

    let user = await this.userRepository.findOne({
      where: { provider, providerId },
    });

    if (!user) {
      await this.signUp(signUpDto);
      user = await this.userRepository.findOne({
        where: { provider, providerId },
      });
    }

    if (!user) {
      throw new UnauthorizedException('OAuth user creation failed');
    }

    return this.generateTokens(user.id, user.username);
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      const userId = payload.userId;

      await this.validateStoredToken(userId, refreshToken);

      const user = await this.findUserById(userId);

      return this.generateTokens(user.id, user.username);
    } catch {
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

  async logout(userId: number): Promise<{ message: string }> {
    await this.redisRepository.deleteAuthData(`refresh:${userId}`);
    const user = await this.findUserById(userId);
    if (user.isGuest) {
      await this.userRepository.delete({ id: userId });
      return { message: 'Guest user data successfully deleted' };
    }
    return { message: 'User logged out successfully' };
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

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private async registerGuestUser(guestName: string): Promise<void> {
    await this.signUp({ name: guestName, isGuest: true });
  }

  private async cacheGuestUser(userId: number): Promise<void> {
    await this.redisRepository.setAuthData(
      `guest:${userId}`,
      JSON.stringify({ userId }),
      GUEST_ID_TTL,
    );
  }

  private async checkUserConflict(
    name: string,
    provider?: string,
    providerId?: string,
    isGuest?: boolean,
  ): Promise<void> {
    const existingUser = isGuest
      ? await this.userRepository.findOneBy({ username: name })
      : await this.userRepository.findOne({ where: { provider, providerId } });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
  }

	private async initializeAccountForUser(user: User): Promise<void> {
		await this.accountRepository.save({
			user,
			KRW: DEFAULT_KRW,
			availableKRW: DEFAULT_KRW,
			USDT: DEFAULT_USDT,
			BTC: DEFAULT_BTC,
		});
	}
  private async createUser(signUpDto: SignUpDto): Promise<User> {
    const { name, email, provider, providerId, isGuest } = signUpDto;
    return this.userRepository.save({
      username: name,
      email,
      provider,
      providerId,
      isGuest,
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<any> {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.refreshSecret,
    });
  }

  private async validateStoredToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const storedToken = await this.redisRepository.getAuthData(
      `refresh:${userId}`,
    );

    if (!storedToken) {
      throw new ForbiddenException('Refresh token has expired');
    }

    if (storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
