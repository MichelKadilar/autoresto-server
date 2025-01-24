import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationProductEntity } from './reservation-product.entity';
import { ReservationProductService } from './reservation-product.service';
import { ProductEntity } from '../product/product.entity';
import { CacheManagerModule } from '../cache/cache.module';
import { ReservationService } from '../reserve/reservation.service';
import { ProductService } from '../product/product.service';
import { Reservation } from '../reserve/reservation.entity';
import { ProductUtilService } from '../product/product-util.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ReservationProductEntity, ProductEntity, Reservation]), CacheManagerModule],
  providers: [ReservationProductService, ReservationService, ProductService, ProductUtilService],
})
export class ReservationProductModule {
}
