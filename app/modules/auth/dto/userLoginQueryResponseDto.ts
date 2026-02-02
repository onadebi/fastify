import SocialLogin from './socialLogin';
import UserLoginDto from './userLoginDto';

export default class UserLoginQueryResponseDto extends UserLoginDto {
    firstName!: string;
    lastName!: string;
    isEmailConfirmed: boolean = false;
    isDeactivated: boolean = false;
    isDeleted: boolean = false;
    id: number = 0;
    guid?: string;
}

export class UserLoginResponse {
    token?: string;
    socialLogin?: SocialLogin;
    firstName?: string;
    lastName?: string;
    email?: string | null;
    guid?: string;
    id: string = '';
    roles: string[] = [];
}