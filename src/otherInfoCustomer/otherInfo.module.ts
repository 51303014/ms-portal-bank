import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {
    OtherInfoCustomerDatabaseName,
    OtherInfoCustomerEntity,
    OtherInfoCustomerSchema
} from "./schema/otherInfo.schema";
import {OtherInfoService} from "./service/otherInfo.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: OtherInfoCustomerEntity.name,
                    schema: OtherInfoCustomerSchema,
                    collection: OtherInfoCustomerDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [OtherInfoService],
    providers: [OtherInfoService],
    controllers: [],
})
export class OtherInfoModule {}
