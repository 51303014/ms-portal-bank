import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import {IncomeDatabaseName, IncomeEntity, IncomeSchema} from "./schema/income.schema";
import {IncomeService} from "./service/income.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: IncomeEntity.name,
                    schema: IncomeSchema,
                    collection: IncomeDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [IncomeService],
    providers: [IncomeService],
    controllers: [],
})
export class IncomeModule {}
