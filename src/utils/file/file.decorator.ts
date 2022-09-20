import {applyDecorators, UseInterceptors} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {ENUM_FILE_TYPE} from './file.constant';
import {FileDocsInterceptor} from './interceptor/file.image.interceptor';

export function UploadFileSingle(
    field: string,
    type: ENUM_FILE_TYPE,
    required?: boolean
): any {
    console.log(type);
    if (type === ENUM_FILE_TYPE.CSV || type === ENUM_FILE_TYPE.EXCEL) {
        return applyDecorators(
            UseInterceptors(
                FileInterceptor(field),
                FileDocsInterceptor(required)
            )
        );
    }

    return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(
    field: string,
    type: ENUM_FILE_TYPE,
    required?: boolean
): any {
    if (type === ENUM_FILE_TYPE.CSV || type === ENUM_FILE_TYPE.EXCEL) {
        return applyDecorators(
            UseInterceptors(
                FilesInterceptor(field),
                FileDocsInterceptor(required)
            )
        );
    }

    return applyDecorators(UseInterceptors(FilesInterceptor(field)));
}
