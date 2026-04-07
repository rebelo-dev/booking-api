import { Controller, Get, Query } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
    constructor(private slotsService: SlotsService) { }

    @Get()
    generate(
        @Query('start') start: string,
        @Query('end') end: string,
        @Query('interval') interval: string,
    ) {
        return this.slotsService.generateSlots(
            new Date(start),
            new Date(end),
            Number(interval),
        );
    }
}