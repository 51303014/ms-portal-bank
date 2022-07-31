import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {CompanyDatabaseName, CompanyEntity, CompanySchema} from "./schema/company.schema";
import {CompanyService} from "./service/company.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: CompanyEntity.name,
                    schema: CompanySchema,
                    collection: CompanyDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [CompanyService],
    providers: [CompanyService],
    controllers: [],
})
export class CompanyModule {}
