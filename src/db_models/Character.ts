import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

interface location_data {
  url: string,
  name: string
}

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column()
  species: string;

  @Column()
  type: string;

  @Column()
  gender: string;

  @Column()
  image: string;

  @Column({ type: 'jsonb', nullable: true })
  origin: location_data;

  @Column({ type: 'jsonb', nullable: true })
  location: location_data;

  @Column('text', { array: true })
  episode: string[];

  @Column()
  url: string;

  @CreateDateColumn()
  created: Date;
}
