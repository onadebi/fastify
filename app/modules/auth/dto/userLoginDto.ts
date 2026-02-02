import SocialLogin from './socialLogin';

export default class UserLoginDto {
    email!: string;
    password?: string;
    socialLogin!: SocialLogin;
}