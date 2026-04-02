import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()

export class ProvidersService {
    constructor(private prisma: PrismaService) { }

    async createProvider(userId: string, businessName: string) {
        return this.prisma.provider.create({
            data: {
                userId,
                businessName,
            },
        });
    }
}
