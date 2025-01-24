import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { ReservationProductEntity } from './reservation-product.entity';
import { ProductEntity } from '../product/product.entity';
import { CreateReservationProduct } from './create-reservation-product';

@Injectable()
export class ReservationProductService {

  constructor(
    @InjectRepository(ReservationProductEntity)
    private readonly reservationProductRepository: Repository<ReservationProductEntity>,
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
    private readonly cacheService: CacheService,
  ) {
  }

  async getProductsOfReservation(reservationId: number): Promise<ProductEntity[]> {

    const reservationProducts = await this.reservationProductRepository.find({
      where: { reservationId },
    });

    const productBffIds = reservationProducts.map((rp) => rp.productBffId);

    return await this.productEntityRepository.findByIds(productBffIds);
  }

  async createReservationProduct(createReservationProduct: CreateReservationProduct): Promise<ReservationProductEntity> {
    const reservationProduct = this.reservationProductRepository.create(createReservationProduct);
    return this.reservationProductRepository.save(reservationProduct);
  }


  async saveProductsOfReservation(productsId: number[], reservationId: number): Promise<void> {
    for (const productId of productsId) {
      const createReservationProductDto: CreateReservationProduct = {
        productBffId: productId,
        reservationId: reservationId,
      };
      await this.createReservationProduct(createReservationProductDto);
    }
  }

}
