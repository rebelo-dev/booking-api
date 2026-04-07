import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
    constructor(private service: AppointmentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req, @Body() body) {
        return this.service.createAppointment(
            req.user.userId,
            body.providerId,
            new Date(body.startTime),
            new Date(body.endTime),
        );
    }
}