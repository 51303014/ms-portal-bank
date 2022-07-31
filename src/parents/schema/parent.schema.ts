import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document} from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class ParentEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cifRelevant?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fullNameRelevant?: string;

    @Prop({
        required: false,
        trim: true,
    })
    relationship?: string;
}

export const ParentDatabaseName = 'parents';
export const ParentSchema = SchemaFactory.createForClass(ParentEntity);

export type ParentDocument = ParentEntity & Document;

// Hooks
ParentSchema.pre<ParentDocument>('save', function (next) {
    next();
});
