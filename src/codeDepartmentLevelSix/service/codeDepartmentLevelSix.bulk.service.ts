import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { DatabaseEntity } from 'src/database/database.decorator';
import { DeleteResult } from 'mongodb';
import {CodeDepartmentLevelSixDocument, CodeDepartmentLevelSixEntity} from "../schema/codeDepartmentLevelSix.schema";
import {CodeDepartmentLevelSixCreateDto} from "../dto/codeDepartmentLevelSix.create.dto";

@Injectable()
export class CodeDepartmentLevelSixBulkService {
    constructor(
        @DatabaseEntity(CodeDepartmentLevelSixEntity.name)
        private readonly codeLevelSixModel: Model<CodeDepartmentLevelSixDocument>
    ) {}

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return await this.codeLevelSixModel.deleteMany(find);
    }

    async createMany(data: CodeDepartmentLevelSixCreateDto[]): Promise<CodeDepartmentLevelSixDocument[]> {
        return this.codeLevelSixModel.insertMany(
            data.map(({ name, code }) => ({
                name,
                isActive: true,
                code,
            }))
        );
    }
}
