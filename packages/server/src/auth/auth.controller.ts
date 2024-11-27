import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
	ApiBody,
	ApiBearerAuth,
	ApiSecurity,
	ApiResponse,
} from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { FRONTEND_URL } from './constants';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiBody({ type: SignInDto })
	@HttpCode(HttpStatus.OK)
	@Post('login')
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.username);
	}

	@HttpCode(HttpStatus.OK)
	@Post('guest-login')
	guestSignIn() {
		return this.authService.guestSignIn();
	}

	@Get('google')
	@UseGuards(PassportAuthGuard('google'))
	async googleLogin() {}

	@Get('google/callback')
	@UseGuards(PassportAuthGuard('google'))
	async googleLoginCallback(@Request() req, @Res() res): Promise<void> {
		const tokens = await this.handleOAuthLogin(req.user);
		this.redirectWithTokens(res, tokens);
	}

	@Get('kakao')
	@UseGuards(PassportAuthGuard('kakao'))
	async kakaoLogin() {}

	@Get('kakao/callback')
	@UseGuards(PassportAuthGuard('kakao'))
	async kakaoLoginCallback(@Request() req, @Res() res): Promise<void> {
		const tokens = await this.handleOAuthLogin(req.user);
		this.redirectWithTokens(res, tokens);
	}

	@ApiResponse({
		status: HttpStatus.OK,
		description: 'New user successfully registered',
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid input or user already exists',
	})
	@HttpCode(HttpStatus.CREATED)
	@Post('signup')
	async signUp(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto);
	}

	@ApiBearerAuth('access-token')
	@ApiSecurity('access-token')
	@UseGuards(AuthGuard)
	@Delete('logout')
	logout(@Request() req) {
		return this.authService.logout(req.user.userId);
	}

	@UseGuards(AuthGuard)
	@ApiBearerAuth('access-token')
	@ApiSecurity('access-token')
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				refreshToken: {
					type: 'string',
					description: 'Refresh token used for renewing access token',
					example: 'your-refresh-token',
				},
			},
		},
	})
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	refreshTokens(@Body() body: { refreshToken: string }) {
		return this.authService.refreshTokens(body.refreshToken);
	}

	private async handleOAuthLogin(user: any): Promise<any> {
		const signUpDto: SignUpDto = {
			name: user.name,
			email: user.email,
			provider: user.provider,
			providerId: user.id,
			isGuest: false,
		};

		return this.authService.validateOAuthLogin(signUpDto);
	}

	// Helper method to redirect with tokens
	private redirectWithTokens(res: any, tokens: any): void {
		const redirectURL = new URL('/auth/callback', FRONTEND_URL);

		redirectURL.searchParams.append('access_token', tokens.access_token);
		redirectURL.searchParams.append('refresh_token', tokens.refresh_token);
		res.redirect(redirectURL.toString());
	}

  
}
