import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  origin: any;

  @Column({ type: 'jsonb', nullable: true })
  location: any;

  @Column('text', { array: true })
  episode: string[];

  @Column()
  url: string;

  @CreateDateColumn()
  created: Date;
}
