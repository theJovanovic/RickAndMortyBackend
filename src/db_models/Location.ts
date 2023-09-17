import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  dimension: string;

  @Column('text', { array: true })
  residents: string[];

  @Column()
  url: string;

  @CreateDateColumn()
  created: Date;
}
