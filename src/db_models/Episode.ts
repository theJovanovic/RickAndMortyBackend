import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  air_date: string;

  @Column()
  episode: string;

  @Column('text', { array: true })
  characters: string[];

  @Column()
  url: string;

  @CreateDateColumn()
  created: Date;
}
