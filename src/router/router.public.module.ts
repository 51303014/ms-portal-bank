import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthPublicController } from 'src/auth/controller/auth.public.controller';
import { AwsModule } from 'src/aws/aws.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleModule } from 'src/role/role.module';
import { UserPublicController } from 'src/user/controller/user.public.controller';
import { UserModule } from 'src/user/user.module';
import {FileModule} from "../files/file.module";
import {FileController} from "../files/controller/file.controller";

@Module({
    controllers: [UserPublicController,FileController, AuthPublicController],
    providers: [],
    exports: [],
    imports: [UserModule, FileModule, AwsModule, AuthModule, RoleModule, PermissionModule],
})
export class RouterPublicModule {}
