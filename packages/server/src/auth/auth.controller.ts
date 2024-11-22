import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import {
	ApiBody,
	ApiBearerAuth,
	ApiSecurity,
	ApiResponse,
} from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

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
		return this.authService.signUp(signUpDto.username);
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
}
