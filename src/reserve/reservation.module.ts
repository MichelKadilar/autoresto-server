import { Module } from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationProductModule } from '../reservation-product/reservation-product.module';
import { CacheManagerModule } from '../cache/cache.module';
import { ReservationProductEntity } from '../reservation-product/reservation-product.entity';
import { ReservationProductService } from '../reservation-product/reservation-product.service';
import { ProductUtilService } from '../product/product-util.service';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, ReservationProductEntity, ProductEntity]), CacheManagerModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationProductService, ProductUtilService],
})
export class ReservationModule {
}
