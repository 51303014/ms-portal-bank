import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {CardDatabaseName, CardEntity, CardSchema} from "./schema/card.schema";
import {CardService} from "./service/card.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: CardEntity.name,
                    schema: CardSchema,
                    collection: CardDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [CardService],
    providers: [CardService],
    controllers: [],
})
export class CardModule {}
