import { Injectable } from '@nestjs/common';
import { CACHE_TIME } from '~/common/enums/enum';
import { AccountRepository } from '~/database/typeorm/repositories/account.repository';
import { MediaRepository } from '~/database/typeorm/repositories/media.repository';
import { CacheService } from '~/shared/services/cache.service';

@Injectable()
export class DatabaseService {
    constructor(public readonly account: AccountRepository, public readonly media: MediaRepository, private readonly cacheService: CacheService) {
        // load all departments to cache
        // this.loadDepartmentsToCache();
        // this.loadPermissionsByRoleToCache();
    }
}
