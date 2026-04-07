import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async createAppointment(
        userId: string,
        providerId: string,
        startTime: Date,
        endTime: Date,
    ) {

        if (startTime >= endTime) {
            throw new BadRequestException('Invalid schedule');
        }

        const conflict = await this.prisma.appointment.findFirst({
            where: {
                providerId,
                status: {
                    not: 'CANCELLED',
                },
                startTime: {
                    lt: endTime,
                },
                endTime: {
                    gt: startTime,
                },
            },
        });

        if (conflict) {
            throw new BadRequestException('Time slot unavailable');
        }

        return this.prisma.appointment.create({
            data: {
                userId,
                providerId,
                startTime,
                endTime,
            },
        });
    }
}