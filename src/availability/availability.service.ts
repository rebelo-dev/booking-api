import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
    constructor(private prisma: PrismaService) { }

    async createAvailability(userId: string, startTime: Date, endTime: Date) {
        if (startTime >= endTime) {
            throw new BadRequestException('Invalid time range');
        }

        const provider = await this.prisma.provider.findUnique({
            where: { userId },
        });

        if (!provider) {
            throw new BadRequestException('User is not a provider');
        }

        return this.prisma.availability.create({
            data: {
                providerId: provider.id,
                startTime,
                endTime,
            },
        });
    }

    async getAvailability(providerId: string) {
        return this.prisma.availability.findMany({
            where: { providerId },
            orderBy: { startTime: 'asc' },
        });
    }

    async getAvailableSlots(providerId: string) {
        const availability = await this.prisma.availability.findMany({
            where: { providerId },
        });

        const appointments = await this.prisma.appointment.findMany({
            where: {
                providerId,
                status: {
                    not: 'CANCELLED',
                },
            },
        });

        const slots: { startTime: Date; endTime: Date }[] = [];

        for (const a of availability) {
            let current = new Date(a.startTime);

            while (current < a.endTime) {
                const next = new Date(current.getTime() + 30 * 60000);

                const isBooked = appointments.some(
                    (appt) =>
                        current < appt.endTime &&
                        next > appt.startTime
                );

                if (!isBooked) {
                    slots.push({
                        startTime: current,
                        endTime: next,
                    });
                }

                current = next;
            }
        }

        return slots;
    }
}