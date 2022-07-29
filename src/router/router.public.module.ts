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
import {CustomerModule} from "../customers/customer.module";
import {CustomerController} from "../customers/controller/customer.controller";
import {IncomeModule} from "../income/income.module";
import {IncomeController} from "../income/controller/income.controller";
import {CardController} from "../card/controller/card.controller";
import {CardModule} from "../card/card.module";

@Module({
    controllers: [UserPublicController,FileController, CustomerController, IncomeController, CardController, AuthPublicController],
    providers: [],
    exports: [],
    imports: [UserModule, FileModule, CustomerModule, IncomeModule, CardModule, AwsModule, AuthModule, RoleModule, PermissionModule],
})
export class RouterPublicModule {}
