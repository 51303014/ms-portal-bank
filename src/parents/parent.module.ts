import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {ParentDatabaseName, ParentEntity, ParentSchema} from "./schema/parent.schema";
import {ParentService} from "./service/parent.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ParentEntity.name,
                    schema: ParentSchema,
                    collection: ParentDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [ParentService],
    providers: [ParentService],
    controllers: [],
})
export class ParentModule {}
