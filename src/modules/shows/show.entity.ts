import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hall } from '../halls/hall.entity';
import { Movie } from '../movies/movie.entity';

@Entity()
export class Show {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @OneToOne(() => Hall, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @Column()
  start_time: String;

  @Column()
  end_time: String;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
