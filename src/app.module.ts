import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ReservationModule } from './reserve/reservation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reserve/reservation.entity';
import { ReservationProductModule } from './reservation-product/reservation-product.module';
import { ReservationProductEntity } from './reservation-product/reservation-product.entity';
import { CacheManagerModule } from './cache/cache.module';
import { ProductEntity } from './product/product.entity';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ProductModule,
    ReservationModule,
    ReservationProductModule,
    CacheManagerModule,
    SchedulerModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Reservation, ReservationProductEntity, ProductEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
