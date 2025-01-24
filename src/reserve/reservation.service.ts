import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { ReservationDTO } from './reservation.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ReservationService {

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly cacheService: CacheService,
  ) {
  }

  async getAllReservations(): Promise<ReservationDTO[]> {
    const reservations: Reservation[] = await this.reservationRepository.find();
    if (reservations && reservations.length > 0) {
      const reservationsDTO: ReservationDTO[] = [
        ...reservations,
      ];
      await this.cacheService.cacheReservations(reservationsDTO);
      return reservationsDTO;
    }
    return [];
  }

  async getReservationById(id: number): Promise<Reservation> {
    const reservation: Reservation = await this.reservationRepository.findOne({ where: { id } });
    if (reservation) {
      const reservationDTO: ReservationDTO = { ...reservation };
      await this.cacheService.cacheReservation(reservationDTO);
      return reservationDTO;
    }
    return null;
  }

  createReservation(reservationDto: ReservationDTO): Promise<Reservation> {
    this.cacheService.cacheReservation(reservationDto);
    const reservation: Reservation = {
      ...reservationDto,
    };
    return this.reservationRepository.save(reservation);
  }

}