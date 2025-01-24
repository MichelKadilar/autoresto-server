import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ReservationDTO } from '../reserve/reservation.dto';
import { ProductDTO } from '../product/productDto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
  }

  async cacheReservations(reservations: ReservationDTO[]) {
    await this.cacheManager.set('reservations', reservations);
  }

  async cacheReservation(reservation: ReservationDTO) {
    await this.cacheManager.set(String(reservation.id), reservation);
  }

  async getCachedReservations(): Promise<ReservationDTO[] | null> {
    return await this.cacheManager.get('reservations');
  }

  async clearCache(key: string) {
    await this.cacheManager.del(key);
  }

  async cacheProducts(products: ProductDTO[]) {
    await this.cacheManager.set('products', products);
  }

  async cacheProduct(product: ProductDTO) {
    await this.cacheManager.set(String(product.id), product);
  }

  async getCachedProducts(): Promise<ProductDTO[] | null> {
    return await this.cacheManager.get('products');
  }

}
