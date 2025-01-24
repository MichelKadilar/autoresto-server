import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from '../reserve/reservation.entity';

@Entity()
export class ReservationProductEntity {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  productBffId: string;

  @Column()
  reservationId: string;

  @ManyToOne(() => Reservation, (Reservation) => Reservation.id, { cascade: true })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;
}
