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

    @Column({ name: 'first_name', type: 'varchar', length: 255 })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 255 })
    lastName: string;

    @Column({ name: 'phone', type: 'varchar', length: 255 })
    phone: string;

    @Column({ name: 'organization', type: 'varchar', length: 255 })
    organization: string;

    @Column({ name: 'address', type: 'varchar', length: 255 })
    address: string;

    @Column({ name: 'state', type: 'varchar', length: 255 })
    state: string;

    @Column({ name: 'country', type: 'varchar', length: 255 })
    country: string;

    @Column({ name: 'zip_code', type: 'varchar', length: 255 })
    zipCode: string;

    @Column({ name: 'language', type: 'varchar', length: 255 })
    language: string[];

    @Column({ name: 'salt', type: 'varchar', length: 255, nullable: true })
    salt: string;

    @Column({ name: 'secret_token', type: 'varchar', length: 255, nullable: true })
    secretToken: string;

    @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
    avatar: string;

    @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
    description: string;
}
