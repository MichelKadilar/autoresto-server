import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from '../reserve/reservation.entity';
import { ProductEntity } from '../product/product.entity';

@Entity()
export class ReservationProductEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productBffId: number;

  @Column()
  reservationId: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { eager: true, cascade: true })
  @JoinColumn({ name: 'productBffId', referencedColumnName: 'id' })
  product: ProductEntity;

  @ManyToOne(() => Reservation, (reservation) => reservation.id, { eager: true, cascade: true })
  @JoinColumn({ name: 'reservationId', referencedColumnName: 'id' })
  reservation: Reservation;


}
