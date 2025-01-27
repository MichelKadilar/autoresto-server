import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheService } from '../cache/cache.service';
import { ReservationDTO } from '../reserve/reservation.dto';

@Injectable()
export class SchedulerService {
  constructor(private readonly cacheService: CacheService) {
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledActions() {
    const reservations = await this.cacheService.getCachedReservations();

    if (reservations) {
      const now = new Date();
      console.log(now);

      const relevantReservations = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.datetime);

        const timeDifference = Math.abs(reservationDate.getTime() - now.getTime());

        const oneMinuteInMilliseconds = 60 * 1000;

        return timeDifference <= oneMinuteInMilliseconds;
      });

      for (const reservation of relevantReservations) {
        await this.executeScheduledMethod(reservation);
      }
    }
  }

  async executeScheduledMethod(reservation: ReservationDTO) {
    console.log('Réservation traitée', reservation);
    // TODO : GET /tables
    // TODO : POST /tableOrders
    // TODO : POST /tableOrders/{tableOrderId}
  }
}