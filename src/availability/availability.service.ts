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
}