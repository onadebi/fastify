import SocialLogin from './socialLogin';

export default class UserModelCreateDto {
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    confirmPassword!: string;
    userProfileImage?: string;
    socialLogin!: SocialLogin;
}

export class UserAuthUpdatePasswordDto {
    email!: string;
    currentPassword!: string;
    newPassword!: string;
    confirmNewPassword!: string;
}

export class UserAuthChangeForgottenPasswordDto {
    email!: string;
    token!: string;
    newPassword!: string;
    confirmNewPassword!: string;
}