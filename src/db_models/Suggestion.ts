import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';

@Entity('suggestion')
export class Suggestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    creator: string;

    @CreateDateColumn({ type: 'timestamp' })
    date: string;

    @Column()
    plot: string;

    @Column({ default: 0 })
    approvals: number;

    @Column('int', { array: true, nullable: true })
    approve_users_id: number[]
}
