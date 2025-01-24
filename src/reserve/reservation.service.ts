import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { ReservationDTO } from './reservation.dto';
import { CacheService } from '../cache/cache.service';
import { ProductDTO } from '../product/productDto';
import { CreateReservationDTO } from './create-reservation.dto';
import { ReservationProductService } from '../reservation-product/reservation-product.service';
import { MenuItemIdNotFoundException } from '../error/MenuItemIdNotFoundException.exception';
import { ProductUtilService } from '../product/product-util.service';
import { ReservationProductEntity } from '../reservation-product/reservation-product.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationProductEntity)
    private readonly reservationProductRepository: Repository<ReservationProductEntity>,
    private readonly cacheService: CacheService,
    private readonly reservationProductService: ReservationProductService,
    private readonly productUtilService: ProductUtilService,
  ) {
  }

  async getAllReservations(): Promise<ReservationDTO[]> {
    const reservations: Reservation[] = await this.reservationRepository.find();

    const reservationDTOs: ReservationDTO[] = await Promise.all(
      reservations.map(async (reservation) => {
        const productsOfReservation = await this.reservationProductService.getProductsOfReservation(reservation.id);
        const productsDtoOfReservation = productsOfReservation.map(
          (product) => this.productUtilService.convertProductEntityToProductDTO(product)
        );
        return this.convertReservationToReservationDTO(reservation, productsDtoOfReservation);
      })
    );

    await this.cacheService.cacheReservations(reservationDTOs);

    return reservationDTOs;
  }

  async getReservationById(id: number): Promise<ReservationDTO> {
    const cachedReservation = await this.cacheService.getCachedReservations();
    if (cachedReservation) {
      const cached = cachedReservation.find((res) => res.id === id);
      if (cached) return cached;
    }

    const reservation: Reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) return null;

    const productsOfReservation = await this.reservationProductService.getProductsOfReservation(reservation.id);
    const productsDtoOfReservation = productsOfReservation.map((product) => this.productUtilService.convertProductEntityToProductDTO(product));

    const reservationDTO = this.convertReservationToReservationDTO(reservation, productsDtoOfReservation);

    await this.cacheService.cacheReservation(reservationDTO);

    return reservationDTO;
  }

  async createReservation(createReservationDto: CreateReservationDTO): Promise<ReservationDTO> {

    if (createReservationDto.products && createReservationDto.products.length > 0) {
      const savedReservation: Reservation = this.reservationRepository.create(createReservationDto);

      const productsIds: number[] = createReservationDto.products.map(p => p.id);
      await this.reservationProductService.saveProductsOfReservation(productsIds, savedReservation.id);

      const reservationDTO: ReservationDTO = {
        id: savedReservation.id,
        products: createReservationDto.products,
        datetime: createReservationDto.datetime,
      };

      await this.cacheService.cacheReservation(reservationDTO);

      return reservationDTO;
    } else throw new MenuItemIdNotFoundException('');
  }

  private convertReservationToReservationDTO(reservation: Reservation, products: ProductDTO[]): ReservationDTO {
    return {
      id: reservation.id,
      datetime: reservation.datetime,
      products: products,
    };
  }
}
