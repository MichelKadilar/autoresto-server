import { ProductDTO } from '../product/productDto';

export interface ReservationDTO {
  id: string;
  datetime: Date;
  products: ProductDTO[];
}