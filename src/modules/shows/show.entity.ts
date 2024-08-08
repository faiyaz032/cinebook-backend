import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Hall } from '../halls/hall.entity';
import { Movie } from '../movies/movie.entity';

@Entity()
@Unique(['movie', 'hall', 'start_time'])
export class Show {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Hall, { onDelete: 'CASCADE' })
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
