import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'user_logs' })
export class UserLogEntity extends AbstractEntity {
    @ObjectIdColumn()
    id: string;

    @Column({ name: 'username', unsigned: true, nullable: true })
    username: string;

    @Column({ name: 'ip', type: 'varchar', length: 255, nullable: true })
    ip: string;

    @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
    userAgent: string;
}
