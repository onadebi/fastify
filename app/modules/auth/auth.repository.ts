import { JWT } from "@fastify/jwt";
import { eq } from "drizzle-orm";
import { dbConn } from "../../common/config/dbConfig";
import { userApp, UserAppDetail, UserAppModel, userprofile, UserProfileModel } from "../../db/schema/auth/auth.model";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { RegisterInput, LoginInput } from "./dto/authLogin.dto";
import GenResponse, { StatusCode } from "../../utils/GenResponse";
import { SocialLoginPlatform } from "./dto/socialLogin";
import { appServices } from "../../common/services/appservices";
import { UserLoginResponse } from "./dto/userLoginQueryResponseDto";
import UserModelCreateDto from "./dto/userModelCreateDto";
import UserLoginDto from "./dto/userLoginDto";
import { randomUUID } from "crypto";
import TokenService from "../../common/services/auth/tokenService";

export class AuthRepository {

    private readonly db = dbConn;

    //#region Login that include Clerk authentication
    login = async (userLogin: UserLoginDto): Promise<GenResponse<UserLoginResponse>> => {
        userLogin.email = userLogin.email.trim().toLowerCase();
        let objResp: GenResponse<UserLoginResponse> = new GenResponse();
        try {
            const userDetail = await this.getUserProfileByUserEmail(userLogin.email);
            if (userDetail && userDetail.data && userDetail.data.userProfile) {
                let isValidPwd: boolean = false;
                const user = userDetail.data.userProfile;
                if (userLogin.socialLogin.isSocialLogin && userLogin.socialLogin.app_id) {
                    //TODO: Call Service to validate token
                    let socialAuthResp: GenResponse<boolean> = new GenResponse();
                    // if (userLogin.socialLogin.socialLoginAppName == SocialLoginPlatform.Clerk) {
                    //     socialAuthResp = await this._socialAuthRepository.clertAuthIsValid(userLogin.socialLogin.token);
                    // }
                    // let userObjDetail: GenResponse<UserAppDetail | null> = new GenResponse();
                    const allSocialLoginPlatforms: string[] = Object.values(SocialLoginPlatform).map((val) => val.toLowerCase());

                    if (userLogin.socialLogin.socialLoginAppName && allSocialLoginPlatforms.includes(userLogin.socialLogin.socialLoginAppName?.toLowerCase())) {
                        //#region 
                        // TODO: Update to use GOogle AUth
                        // if ((userDetail.data.userApp && userDetail.data.userApp.app_id)  && clerkSession) {
                        //         const clerkAuthStatus = authenticateClerkSession(clerkSession);
                        //         socialAuthResp.isSuccess = socialAuthResp.data = clerkAuthStatus.isSuccess;
                        //         if(clerkAuthStatus.isSuccess){
                        //             //Check for app_id and update to latest if different
                        //             if(userDetail.data.userApp.app_id !== userLogin.socialLogin.app_id){
                        //                 const userAppUpdate = await this.db.update(userApp).set({app_id: userLogin.socialLogin.app_id}).returning({new_app_id: userApp.app_id}).where(eq(userApp.app_id, userDetail.data.userApp.app_id)).execute();
                        //                 if(userAppUpdate && userAppUpdate.length > 0 && userAppUpdate[0].new_app_id === userLogin.socialLogin.app_id){
                        //                     console.log(JSON.stringify(userAppUpdate[0], null, 2));
                        //                     userDetail.data.userApp.app_id = userLogin.socialLogin.app_id;
                        //                 }
                        //             }
                        //         }
                        // }else{
                        //     objResp.message = objResp.error = "Invalid social login details.";
                        //     objResp.statusCode = StatusCode.Unauthorized;
                        //     objResp.data = null;
                        //     objResp.isSuccess = false;
                        //     return objResp;
                        // }
                        //#endregion
                    }
                    if (!socialAuthResp.isSuccess) {
                        objResp.message = socialAuthResp.message;
                        objResp.error = "Invalid login details.";
                        objResp.statusCode = StatusCode.Unauthorized;
                        objResp.data = null;
                        objResp.isSuccess = false;
                        return objResp;
                    }
                } else if ((user.password && userLogin.password) || userLogin.socialLogin.isSocialLogin === false) {
                    //TODO: Validate Ecrypted Password before checking
                    isValidPwd = await verifyPassword(userLogin.password!, user.password!);
                    if (!isValidPwd) {
                        objResp.message = objResp.error = "Invalid login credentials.";
                        objResp.statusCode = StatusCode.Unauthorized;
                        objResp.data = null; objResp.isSuccess = false;
                        return objResp;
                    }
                }
                if (!user.isActive || user.isDeleted) {
                    objResp.message = "User account is currently deactivated or deleted.";
                    objResp.statusCode = StatusCode.Forbidden;
                    objResp.data = null;
                    objResp.isSuccess = false;
                    return objResp;
                } else {
                    const userLoginResp: UserLoginResponse = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        id: user.guid ?? '',
                        roles: user.roles,
                        socialLogin: userLogin.socialLogin
                    };
                    objResp.message = TokenService.authSetToken(userLoginResp);
                    objResp.data = userLoginResp;
                    try {
                        userLoginResp.socialLogin!.token = objResp.message;
                    }catch(error){
                        appServices.commonService.LogError(`[${`[AuthRepository][login][login]`}] Error assigning token to ${userLoginResp.email}`);
                    }
                    objResp.isSuccess = true;
                    objResp.statusCode = StatusCode.OK;
                    return objResp;
                }
            } else {
                objResp.message = objResp.error = "User account not found or has been deleted.";
                objResp.statusCode = StatusCode.NotFound;
                objResp.data = null;
                objResp.isSuccess = false;
            }
        } catch (error) {
            appServices.commonService.LogActivity(`[${`[AuthRepository][login]`}] ${JSON.stringify(error, null, 2)}`);
        }
        return objResp;
    }
    //#endregion

      registerUser = async (user: UserModelCreateDto,clerkSession?: string): Promise<GenResponse<UserLoginResponse>> => {
        let objResp: GenResponse<UserLoginResponse> = new GenResponse();
        if (!user) {
            objResp.error = "Invalid user data.";
            objResp.statusCode = StatusCode.BadRequest;
            objResp.data = null;
            objResp.isSuccess = false;
            return objResp;
        }
        if (user.password !== user.confirmPassword && !user.socialLogin.isSocialLogin) {
            objResp.error = "Passwords do not match.";
            objResp.statusCode = StatusCode.BadRequest;
            objResp.data = null;
            objResp.isSuccess = false;
            return objResp;
        }
        user.email = user.email.trim().toLowerCase();
        try {
            let isExistingUser: UserProfileModel;
            const userDetail = await this.db.select().from(userprofile).where(eq(userprofile.email, user.email)).limit(1);
            if (userDetail && userDetail.length > 0) {
                objResp.message = "User account already exists.";
                objResp.statusCode = StatusCode.Forbidden;
                objResp.data = null;
                objResp.isSuccess = false;
            } else {
                const newUserReg: UserProfileModel = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.socialLogin.isSocialLogin ? user.password : await hashPassword(user.password),
                    roles: ['user'],
                    isActive: true,
                    userProfileImage: user.userProfileImage ?? null,
                    displayName: user.firstName + " " + user.lastName,
                    guestId: null,
                    expiresAt: null,
                    isSocialLogin: user.socialLogin.isSocialLogin,
                    socialLoginPlatform: user.socialLogin.socialLoginAppName ?? null,
                    username: user.email,
                    isDeleted: false,
                    //#endregion
                }
                const newUser = await this.db.insert(userprofile).values(newUserReg).returning({ id: userprofile.id, guid: userprofile.guid }).execute();
                if (newUser && newUser.length > 0 && newUser[0]) {
                    const newUserGuid = newUser[0].guid;
                    //TODO: insert record into userApp table
                    // #region Insert into userApp
                    const userAppDetail: UserAppModel = {
                        user_id: newUserGuid,
                        social_platform: user.socialLogin.socialLoginAppName ?? SocialLoginPlatform.OnaxApp,
                        oauth_identity: user.socialLogin.oauth_identity ?? '',
                        app_id: user.socialLogin.app_id ?? newUserGuid,
                    };
                    const userAppResp = await this.db.insert(userApp).values(userAppDetail).returning({ user_id: userApp.user_id, app_id: userApp.app_id }).execute();
                    if (userAppResp && userAppResp.length > 0 && userAppResp[0]) {
                        console.log(JSON.stringify({ userId: userAppResp[0].user_id, app_id: userAppResp[0].app_id }, null, 2));
                    }
                    // #endregion
                    objResp.data = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        id: newUserGuid,
                        roles: ['user'],
                        socialLogin: user.socialLogin
                    };
                    objResp.isSuccess = true;
                    objResp.statusCode = StatusCode.Created;
                } else {
                    objResp.message = objResp.error = "Error creating user account.";
                    objResp.statusCode = StatusCode.ServerError;
                    objResp.data = null;
                    objResp.isSuccess = false;
                }
            }
        } catch (error) {
            appServices.commonService.LogError(`[${`[AuthRepo][registerUser]`}] ${JSON.stringify(error, null, 2)}`);
        }
        return objResp;
    }

        getUserProfileByUserAppId = async (user_appId: string): Promise<GenResponse<UserAppDetail | null>> => {
        const objResp: GenResponse<UserAppDetail | null> = new GenResponse();
        objResp.data = {
            userApp: {} as UserAppModel,
            userProfile: {} as UserProfileModel
        }
        if (!user_appId) {
            objResp.error = "Invalid App Id.";
            objResp.statusCode = StatusCode.BadRequest;
            objResp.data = null;
            objResp.isSuccess = false;
            return objResp;
        }
        try {
            const userDetail = await this.db.select().from(userApp).innerJoin(userprofile, eq(userApp.user_id, userprofile.guid))
                .where(eq(userApp.app_id, user_appId)).limit(1);
            if (userDetail && userDetail.length > 0 && userDetail[0]) {
                objResp.isSuccess = true;
                objResp.data.userApp = userDetail[0].userApp;
                objResp.data.userProfile = userDetail[0].users;
            }
            console.log(userDetail[0]);
        } catch (error) {
            appServices.commonService.LogError(`[${`[AuthRepository][getUserProfileByUserAppId]`}] ${JSON.stringify(error, null, 2)}`);
        }
        return objResp;
    }

    getUserProfileByUserEmail = async (userEmail: string): Promise<GenResponse<UserAppDetail | null>> => {
        const objResp: GenResponse<UserAppDetail | null> = new GenResponse();
        objResp.data = {
            userApp: {} as UserAppModel,
            userProfile: {} as UserProfileModel
        }
        if (!userEmail) {
            objResp.error = "Invalid user email.";
            objResp.statusCode = StatusCode.BadRequest;
            objResp.data = null;
            objResp.isSuccess = false;
            return objResp;
        }
        try {
            userEmail = userEmail.trim().toLowerCase();
            const userDetail = await this.db.select().from(userprofile).innerJoin(userApp, eq(userprofile.guid,userApp.user_id))
                .where(eq(userprofile.email, userEmail)).limit(1);
            if (userDetail && userDetail.length > 0 && userDetail[0]) {
                objResp.isSuccess = true;
                objResp.data.userApp = userDetail[0].userApp;
                objResp.data.userProfile = userDetail[0].users;
            }
            console.log(userDetail[0]);
        } catch (error) {
            appServices.commonService.LogError(`[${`[AuthRepository][getUserProfileByUserEmail]`}] ${JSON.stringify(error, null, 2)}`);
        }
        return objResp;
    }

    deleteUserProfileByUserAppId = async (user_appId: string): Promise<GenResponse<boolean>> => {
        const objResp: GenResponse<boolean> = new GenResponse();
        objResp.data = false;
        if (!user_appId) {
            objResp.error = "Invalid App Id.";
            objResp.statusCode = StatusCode.BadRequest;
            objResp.data = false;
            objResp.isSuccess = false;
            return objResp;
        }
        try {
            const userAppDelete = await this.db.update(userApp).set({isDeleted: true, isActive: false, updated_at: new Date().toISOString(), app_id:`DEL_${randomUUID()}-${userApp.app_id}`, deleted_as:userApp.app_id}).returning({user_id: userApp.user_id}).where(eq(userApp.app_id, user_appId)).execute();
            if(userAppDelete && userAppDelete.length > 0 && userAppDelete[0]){
                const user_id = userAppDelete[0].user_id;
                const userRandomUUID = randomUUID();
                const userProfileDelete = await this.db.update(userprofile).set({isDeleted: true, isActive: false, updated_at: new Date().toISOString(), email: `DEL_${userRandomUUID}-${userprofile.email}`, username:`DEL_${userRandomUUID}-${userprofile.email}`, deleted_as: userprofile.email}).where(eq(userprofile.guid, user_id)).execute();
                if (userAppDelete && userProfileDelete) {
                    objResp.isSuccess = true;
                    objResp.data = true;
                }
            }
        } catch (error) {
            appServices.commonService.LogError(`[${`[AuthRepository][deleteUserProfileByUserAppId]`}] ${JSON.stringify(error, null, 2)}`);
        }
        return objResp;
    }

}