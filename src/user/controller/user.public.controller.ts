import {
    Controller,
    Get,
} from '@nestjs/common';
import { AuthPublicJwtGuard } from 'src/auth/auth.decorator';
import { AwsS3Service } from 'src/aws/service/aws.s3.service';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { UserService } from '../service/user.service';
import { GetUser, UserProfileGuard } from '../user.decorator';
import { IUserDocument } from '../user.interface';

@Controller({
    version: '1',
    path: 'user',
})
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(UserPublicController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationProfile(user);
    }

}
