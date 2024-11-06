import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

interface OrderProducts {
  id: number;
  requestedQuantity: number;
}

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn() // Automatically generates an ID
  id: number;

  @Column('json', { default: [] })
  products: OrderProducts[];

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
