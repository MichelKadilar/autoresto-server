import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from '../reserve/reservation.entity';

@Entity()
export class ProductEntity {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  fullName: string;

  @Column()
  shortName: string;

  @Column()
  price: number;

  @Column()
  category: 'STARTER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';

  @Column()
  subcategory: string;

  @Column()
  image: string;

  @Column()
  backendProductId: string;

  @Column()
  reservationId: string;

  @ManyToOne(() => Reservation, (Reservation) => Reservation.id, { cascade: true })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;
}
