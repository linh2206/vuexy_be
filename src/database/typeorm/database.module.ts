import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseService } from '~/database/typeorm/database.service';
import { AccountEntity } from '~/database/typeorm/entities/account.entity';
import { MediaEntity } from '~/database/typeorm/entities/media.entity';
import { UserLogEntity } from '~/database/typeorm/entities/userLog.entity';
import { AccountRepository } from '~/database/typeorm/repositories/account.repository';
import { MediaRepository } from '~/database/typeorm/repositories/media.repository';

const entities = [MediaEntity, AccountEntity, UserLogEntity];

const repositories = [AccountRepository, MediaRepository];

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                ...configService.get('database'),
                entities,
            }),
            inject: [ConfigService],
            // dataSource receives the configured DataSourceOptions
            // and returns a Promise<DataSource>.
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
        // TypeOrmModule.forFeature(entities),
    ],
    providers: [DatabaseService, ...repositories],
    exports: [DatabaseService],
})
export class DatabaseModule {}
