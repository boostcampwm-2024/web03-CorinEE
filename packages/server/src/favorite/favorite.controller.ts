import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Request,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import { FavoriteService } from './favorite.service';
import { ApiBearerAuth, ApiQuery, ApiSecurity } from '@nestjs/swagger';
@Controller('favorite')
@ApiBearerAuth('access-token')
@ApiSecurity('access-token')
@UseGuards(AuthGuard)
export class FavoriteController {
	constructor(private favoriteService: FavoriteService) {}
	@ApiQuery({ name: 'assetName', required: false, type: String })
	@Get()
	async getFavorites(
		@Request() req,
		@Res() res,
		@Query('assetName') assetName?: string,
	) {
		try {
			const result = await this.favoriteService.getFavorites(
				req.user,
				assetName,
			);
			return res.status(result.statusCode).json(result);
		} catch {
			return res.status(500).json({ message: 'Failed to get favorites.' });
		}
	}

	@Post()
	async createFavorite(
		@Query('assetName') assetName: String,
		@Request() req,
		@Res() res,
	) {
		try {
			return this.favoriteService.createFavorite(req.user, assetName);
		} catch {
			return res.status(500).json({ message: 'Failed to create favorite.' });
		}
	}

	@Delete()
	async deleteFavorite(
		@Query('assetName') assetName: String,
		@Request() req,
		@Res() res,
	) {
		try {
			return this.favoriteService.deleteFavorite(req.user, assetName);
		} catch {
			return res.status(500).json({ message: 'Failed to delete favorite.' });
		}
	}

	@Post('/toggle')
	async toggleFavorite(
		@Query('assetName') assetName: String,
		@Request() req,
		@Res() res,
	) {
		try {
			return this.favoriteService.toggleFavorite(req.user, assetName);
		} catch {
			return res.status(500).json({ message: 'Failed to toggle favorite.' });
		}
	}
}
