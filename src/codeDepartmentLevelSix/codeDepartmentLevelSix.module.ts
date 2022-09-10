import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {
    CodeDepartmentLevelSixDatabaseName,
    CodeDepartmentLevelSixEntity,
    CodeDepartmentLevelSixSchema
} from "./schema/codeDepartmentLevelSix.schema";
import {CodeDepartmentLevelSixService} from "./service/codeDepartmentLevelSix.service";
import {CodeDepartmentLevelSixBulkService} from "./service/codeDepartmentLevelSix.bulk.service";

@Module({
    controllers: [],
    providers: [CodeDepartmentLevelSixService, CodeDepartmentLevelSixBulkService],
    exports: [CodeDepartmentLevelSixService, CodeDepartmentLevelSixBulkService],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: CodeDepartmentLevelSixEntity.name,
                    schema: CodeDepartmentLevelSixSchema,
                    collection: CodeDepartmentLevelSixDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class CodeDepartmentLevelSixModule {}
