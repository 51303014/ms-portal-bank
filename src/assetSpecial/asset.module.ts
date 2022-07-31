import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {AssetDataBaseName, AssetEntity, AssetSchema} from "./schema/asset.schema";
import {AssetService} from "./service/asset.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: AssetEntity.name,
                    schema: AssetSchema,
                    collection: AssetDataBaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [AssetService],
    providers: [AssetService],
    controllers: [],
})
export class AssetModule {}
