import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { ReservationDTO } from './reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {
  }

  @Get()
  getAllReservations(): Promise<Reservation[]> {
    return this.reservationService.getAllReservations();
  }

  @Get(':id')
  getReservationById(@Param('id') id): Promise<Reservation> {
    return this.reservationService.getReservationById(id);
  }

  @Post()
  createReservation(@Body() reservationDto: ReservationDTO): Promise<Reservation> {
    return this.reservationService.createReservation(reservationDto);
  }

}
