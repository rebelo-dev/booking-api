import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConfigModule } from '@nestjs/config';
import { SlotsService } from './slots/slots.service';
import { SlotsController } from './slots/slots.controller';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, AuthModule, UsersModule, ProvidersModule, AvailabilityModule, BookingsModule],
  controllers: [AppController, SlotsController],
  providers: [AppService, SlotsService],
})
export class AppModule { }
