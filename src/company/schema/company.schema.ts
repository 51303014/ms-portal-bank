import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class CompanyEntity {
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
    cifCompany?: string;

    @Prop({
        required: false,
        trim: true,
    })
    position?: string;

    @Prop({
        required: false,
        trim: true,
    })
    nameCompany?: string;

    @Prop({
        required: false,
        trim: true,
    })
    relationshipOtherCompany?: string;
}

export const CompanyDatabaseName = 'companies';
export const CompanySchema = SchemaFactory.createForClass(CompanyEntity);

export type CompanyDocument = CompanyEntity & Document;

// Hooks
CompanySchema.pre<CompanyDocument>('save', function (next) {
    next();
});
