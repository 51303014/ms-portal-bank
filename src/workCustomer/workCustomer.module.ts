import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {WorkCustomerService} from "./service/workCustomer.service";
import {WorkCustomerDatabaseName, WorkCustomerEntity, WorkCustomerSchema} from "./schema/workCustomer.schema";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: WorkCustomerEntity.name,
                    schema: WorkCustomerSchema,
                    collection: WorkCustomerDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [WorkCustomerService],
    providers: [WorkCustomerService],
    controllers: [],
})
export class WorkCustomerModule {}
