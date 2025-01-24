import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {

  @PrimaryGeneratedColumn()
  id: number;

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
}
