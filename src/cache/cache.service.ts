import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ReservationDTO } from '../reserve/reservation.dto';

@Injectable()
export class CacheService {
  constructor(private readonly cacheManager: Cache) {
  }

  async cacheReservations(reservations: ReservationDTO[]) {
    await this.cacheManager.set('reservations', reservations);
  }

  async cacheReservation(reservation: ReservationDTO) {
    await this.cacheManager.set(reservation.id, reservation);
  }

  async getCachedReservations(): Promise<ReservationDTO[] | null> {
    return await this.cacheManager.get('reservations');
  }

  async clearCache(key: string) {
    await this.cacheManager.del(key);
  }
}
