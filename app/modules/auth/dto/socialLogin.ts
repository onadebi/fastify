export default class SocialLogin {
    isSocialLogin: boolean = false;
    socialLoginAppName?: string;
    oauth_identity?: string;
    app_id: string = '';
    token?: string = undefined;
}

export const SocialLoginPlatform = {
    OnaxApp: "onaxapp",
    Google: "oauth_google",
    Clerk: "Clerk",
    Twitter: "Twitter",
    LinkedIn: "LinkedIn",
    GitHub: "GitHub",
    Microsoft: "Microsoft",
    YouTube: "YouTube"
} as const;