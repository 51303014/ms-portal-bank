import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface LocalFilesInterceptorOptions {
    fieldName: string;
    path?: string;
    fileFilter?: MulterOptions['fileFilter'];
    limits?: MulterOptions['limits'];
}

function LocalFilesInterceptor (options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;
        constructor() {
            const filesDestination = './files';

            const destination = `${filesDestination}${options.path}`

            const multerOptions: MulterOptions = {
                storage: diskStorage({
                    destination,
                    filename: (req, file, cb) => {
                        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                        return cb(null, `${randomName}-${file.originalname}`)
                    }
                }),
                fileFilter: options.fileFilter,
                limits: options.limits
            }

            this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions));
        }

        intercept(...args: Parameters<NestInterceptor['intercept']>) {
            return this.fileInterceptor.intercept(...args);
        }
    }
    return mixin(Interceptor);
}

export default LocalFilesInterceptor;
