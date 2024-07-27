import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hall_number: number;

  @Column()
  capacity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
