import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Hall } from './hall.entity';

export enum SeatTypes {
  REGULAR = 'regular',
  PREMIUM = 'premium',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  Booked = 'booked',
}

@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Hall, { onDelete: 'CASCADE' })
  hall: Hall;

  @Column()
  seat_number: string;

  @Column({
    type: 'enum',
    enum: SeatTypes,
  })
  seat_type: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: SeatStatus,
    default: SeatStatus.AVAILABLE,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
