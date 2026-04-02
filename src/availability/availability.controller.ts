import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('availability')
export class AvailabilityController {
    constructor(private availabilityService: AvailabilityService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req, @Body() body) {
        return this.availabilityService.createAvailability(
            req.user.userId,
            new Date(body.startTime),
            new Date(body.endTime),
        );
    }

    @Get()
    findAll(@Query('providerId') providerId: string) {
        return this.availabilityService.getAvailability(providerId);
    }
}