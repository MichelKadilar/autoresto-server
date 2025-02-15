import { ProductDTO } from '../product/productDto';

export interface ReservationDTO {
  id: number;
  datetime: Date;
  products: ProductDTO[];
}