import { Injectable } from '@nestjs/common';

@Injectable()
export class SlotsService {

    generateSlots(start: Date, end: Date, intervalMinutes: number) {
        const slots: string[] = [];

        let current = new Date(start);

        while (current < end) {
            slots.push(current.toISOString());

            current = new Date(current.getTime() + intervalMinutes * 60000);
        }

        return slots;
    }
}