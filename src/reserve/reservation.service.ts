import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { ReservationDTO } from './reservation.dto';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {
  }

  getAllReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  getReservationById(id: number): Promise<Reservation> {
    return this.reservationRepository.findOne({ where: { id } });
  }

  createReservation(reservationDto: ReservationDTO): Promise<Reservation> {
    return this.reservationRepository.save(reservationDto);
  }

}