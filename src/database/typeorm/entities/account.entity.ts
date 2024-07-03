import { Column, Entity, Index, ObjectIdColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { AbstractEntity } from '~/database/typeorm/entities/abstract.entity';

@Entity({ name: 'accounts' })
export class AccountEntity extends AbstractEntity {
    @ObjectIdColumn()
    id: string;

    @Index('IDX_ACCOUNT_USERNAME', { fulltext: true })
    @Column({ name: 'username', type: 'varchar', length: 255 })
    username: string;

    @Index('IDX_ACCOUNT_EMAIL', { fulltext: true })
    @Column({ name: 'email', type: 'varchar', length: 255 })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ name: 'salt', type: 'varchar', length: 255, nullable: true })
    salt: string;

    @Column({ name: 'secret_token', type: 'varchar', length: 255, nullable: true })
    secretToken: string;

    @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
    description: string;
}
