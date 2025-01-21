import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ReservationModule } from './reserve/reservation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reserve/reservation.entity';

@Module({
  imports: [
    ProductModule,
    ReservationModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Reservation], // TODO : add other entities
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
