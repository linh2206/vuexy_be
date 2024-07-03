import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserLogEntity } from '../entities/userLog.entity';

@Injectable()
export class UserLogRepository extends Repository<UserLogEntity> {
    constructor(private dataSource: DataSource) {
        super(UserLogEntity, dataSource.createEntityManager());
    }
}
