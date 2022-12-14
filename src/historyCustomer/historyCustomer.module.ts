import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {
    HistoryCustomerDatabaseName,
    HistoryCustomerEntity,
    HistoryCustomerSchema,
} from './schema/historyCustomer.schema';
import { HistoryCustomerService } from './service/historyCustomer.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: HistoryCustomerEntity.name,
                    schema: HistoryCustomerSchema,
                    collection: HistoryCustomerDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [HistoryCustomerService],
    providers: [HistoryCustomerService],
    controllers: [],
})
export class HistoryCustomerModule {}
