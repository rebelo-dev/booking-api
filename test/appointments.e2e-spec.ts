import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Appointments (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;
    let authToken: string;
    let userId: string;
    let providerId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prisma = app.get(PrismaService);

        // cleanup
        await prisma.appointment.deleteMany({});
        await prisma.availability.deleteMany({});
        await prisma.provider.deleteMany({});
        await prisma.user.deleteMany({});

        // register
        const registerResp = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'user@test.com', password: 'pass123' })
            .expect(201);
        userId = registerResp.body.id;

        // login
        const loginResp = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'pass123' })
            .expect(201);
        authToken = loginResp.body.access_token;

        // register and create provider
        const provReg = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'provider@test.com', password: 'pass123' })
            .expect(201);

        const provLoginResp = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'provider@test.com', password: 'pass123' })
            .expect(201);

        const providerResp = await request(app.getHttpServer())
            .post('/providers')
            .set('Authorization', `Bearer ${provLoginResp.body.access_token}`)
            .send({ businessName: 'Test Clinic' })
            .expect(201);
        providerId = providerResp.body.id;
    });

    afterAll(async () => {
        await prisma.appointment.deleteMany({});
        await prisma.availability.deleteMany({});
        await prisma.provider.deleteMany({});
        await prisma.user.deleteMany({});
        await app.close();
    });

    describe('Appointment Creation', () => {
        it('should create an appointment', async () => {
            const start = new Date('2026-05-10T10:00:00Z');
            const end = new Date('2026-05-10T11:00:00Z');

            const response = await request(app.getHttpServer())
                .post('/appointments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    providerId,
                    startTime: start.toISOString(),
                    endTime: end.toISOString(),
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toBe('PENDING');
        });

        it('should fail with invalid time range', async () => {
            const time = new Date('2026-05-10T10:00:00Z');

            await request(app.getHttpServer())
                .post('/appointments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    providerId,
                    startTime: time.toISOString(),
                    endTime: time.toISOString(),
                })
                .expect(400);
        });
    });

    describe('Double Booking Prevention', () => {
        it('should reject overlapping appointment', async () => {
            //first appointment
            await prisma.appointment.create({
                data: {
                    userId,
                    providerId,
                    startTime: new Date('2026-05-15T10:00:00Z'),
                    endTime: new Date('2026-05-15T11:00:00Z'),
                    status: 'PENDING',
                },
            });

            //overlapping appointment
            await request(app.getHttpServer())
                .post('/appointments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    providerId,
                    startTime: new Date('2026-05-15T10:30:00Z').toISOString(),
                    endTime: new Date('2026-05-15T11:30:00Z').toISOString(),
                })
                .expect(400);
        });
    });

    describe('Slot Generation', () => {
        it('should generate slots with 30-minute intervals', async () => {
            const start = new Date('2026-05-20T09:00:00Z');
            const end = new Date('2026-05-20T11:00:00Z');

            const response = await request(app.getHttpServer())
                .get('/slots')
                .query({
                    start: start.toISOString(),
                    end: end.toISOString(),
                    interval: '30',
                })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });
});

