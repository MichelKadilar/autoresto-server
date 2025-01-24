import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  datetime: Date;

  @Column()
  productId: string;

  @OneToMany(() => ProductEntity, (ProductEntity) => ProductEntity.id, { cascade: true })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
