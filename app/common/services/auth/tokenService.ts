
import jwt from "jsonwebtoken";
import { appServices } from "../appservices";
import { UserLoginResponse } from "../../../modules/auth/dto/userLoginQueryResponseDto";
import appsettings from "../../config/appsettings";
import GenResponse, { StatusCode } from "../../../utils/GenResponse";
import { FastifyReply, FastifyRequest } from "fastify";
import { UnitAnyCase } from "ms";

export default class TokenService {

    static authSetToken = (user: UserLoginResponse): string => {
        let token = '';
        try {
            token = jwt.sign({
                firstName: user.firstName, lastName: user.lastName
                , email: user.email, guid: user.guid, id: user.id, roles: user.roles
            }, appsettings.Auth.JwtSecret, { expiresIn: appsettings.Auth.JwtExpiry as `${number} ${UnitAnyCase}` | number });
        } catch (error) {
            appServices.commonService.LogError(`TokenService.authSetToken, error: ${error}`);
        }
        return token;
    };


    static validateToken = (reqContext: FastifyRequest, reply: FastifyReply, refreshBeforeExpiry: boolean = false): GenResponse<UserLoginResponse> => {
        let objResp = new GenResponse<UserLoginResponse>();
        try {
            //#region check if token is valid
            let decoded: jwt.JwtPayload | string = '';
            const cookie = reqContext.cookies;
            const authHeader = reqContext.headers ? reqContext.headers.authorization : null;
            if (cookie || authHeader) {
                const authToken = cookie ? cookie[appsettings.Auth.Session.tokenName] : authHeader?.split(' ')[1];
                try {
                    decoded = jwt.verify(authToken ?? "", appsettings.Auth.JwtSecret);
                    console.log(JSON.stringify(decoded));
                    objResp.data = decoded as UserLoginResponse;
                    objResp.isSuccess = true;
                    //#region Implement Sliding expiration of token time
                    if (refreshBeforeExpiry) {
                        // Check if expiry time is less than 15 minutes
                        const tokenExpiry = (decoded as any).exp;
                        const currentTime = Math.floor(Date.now() / 1000);
                        if (tokenExpiry - currentTime < 900) {
                            // Refresh token based on sliding expiration
                            const { tokenName, maxAge, httpOnly, expires, secured } = appsettings.Auth.Session;
                            const token = jwt.sign({
                                firstName: objResp.data.firstName, lastName: objResp.data.lastName
                                , email: objResp.data.email, guid: objResp.data.guid, id: objResp.data.id, roles: objResp.data.roles
                            }, appsettings.Auth.JwtSecret, { expiresIn: appsettings.Auth.JwtExpiry as `${number} ${UnitAnyCase}` | number  });
                            reply.cookie(tokenName, `${token}`, {
                                maxAge: maxAge, httpOnly: httpOnly, expires
                                , sameSite: 'none', secure: secured
                            });
                        }
                    }
                    //#endregion
                } catch (err) {
                    objResp.error = 'Invalid token';
                    reply.status(403).send(objResp);
                }
            }
            else {
                objResp.error = 'Invalid token';
                objResp.statusCode = StatusCode.Unauthorized;
                reply.status(objResp.statusCode).send(objResp);
            }
            //#endregion
            // decoded = jwt.verify(token, appsettings.Auth.JwtSecret);
        } catch (error) {
            objResp.error = 'Invalid token';
            objResp.isSuccess = false;
            objResp.data = null;
        }
        return objResp;
    }


    static extractUserDetailFromToken = (token: string): GenResponse<UserLoginResponse> => {
        let objResp = new GenResponse<UserLoginResponse>();
        let decoded: jwt.JwtPayload | string = '';
        try {
            decoded = jwt.verify(token, appsettings.Auth.JwtSecret);
            if (decoded) {
                objResp.data = decoded as UserLoginResponse;
                objResp.isSuccess = true;
            } else {
                objResp.error = 'Invalid token';
                objResp.isSuccess = false;
            }
        } catch (error) {
            objResp.error = 'Invalid token';
            objResp.isSuccess = false;
            objResp.data = null;
        }
        return objResp;
    }

    static verifyToken = (token: string): GenResponse<jwt.JwtPayload | string> => {
        let objResp = new GenResponse<jwt.JwtPayload | string>();
        try {
            objResp.data = jwt.verify(token, appsettings.Auth.JwtSecret);
            objResp.isSuccess = true;
        } catch (error) {
            objResp.error = 'Invalid token';
            objResp.isSuccess = false;
            objResp.data = null;
        }
        return objResp;
    }

    // export const setCookie = (req: Request, resp: Response, next: NextFunction) =>
    // {
    //     const token = jwt.sign({ user: 'onx_user' }, appsettings.Auth.JwtSecret, { expiresIn: appsettings.Auth.JwtExpiry });
    //     resp.cookie('onx_user', `${token}`, { httpOnly: true });
    //     resp.header('Authorization', `Bearer ${token}`);
    //     next();
    // };
}
