import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {CustomerDatabaseName, CustomerEntity, CustomerSchema} from "./schema/customer.schema";
import {CustomerService} from "./service/customer.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: CustomerEntity.name,
                    schema: CustomerSchema,
                    collection: CustomerDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [CustomerService],
    providers: [CustomerService],
    controllers: [],
})
export class CustomerModule {}
