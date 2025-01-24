import { ProductDTO } from '../product/productDto';

export interface CreateReservationDTO {
  datetime: Date;
  products: ProductDTO[];
}