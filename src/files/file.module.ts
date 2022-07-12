import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {FileService} from "./service/file.service";
import {FileDatabaseName, FileEntity, FileSchema} from "./schema/file.schema";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: FileEntity.name,
                    schema: FileSchema,
                    collection: FileDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [FileService],
    providers: [FileService],
    controllers: [],
})
export class FileModule {}
