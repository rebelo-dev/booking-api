import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
    constructor(private providersService: ProvidersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req, @Body() body) {
        return this.providersService.createProvider(
            req.user.userId,
            body.businessName,
        );
    }
}