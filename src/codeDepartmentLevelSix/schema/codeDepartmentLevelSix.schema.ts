import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class CodeDepartmentLevelSixEntity {
    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    name: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true,
    })
    code: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;
}

export const CodeDepartmentLevelSixDatabaseName = 'codeLevelSix';
export const CodeDepartmentLevelSixSchema = SchemaFactory.createForClass(CodeDepartmentLevelSixEntity);

export type CodeDepartmentLevelSixDocument = CodeDepartmentLevelSixEntity & Document;

// Hooks
CodeDepartmentLevelSixSchema.pre<CodeDepartmentLevelSixDocument>('save', function (next) {
    this.name = this.name.toLowerCase();
    next();
});
