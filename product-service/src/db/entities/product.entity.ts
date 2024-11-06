import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn() // Automatically generates an ID
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'available_quantity', type: 'int' })
  availableQuantity: number;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
