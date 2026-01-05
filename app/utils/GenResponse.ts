
class GenResponse<T>{
    isSuccess: boolean;
    data: T| undefined| null;
    message: string | null;
    statusCode: StatusCode;
    error: string | null

    constructor(){
        this.isSuccess = false;
        this.message = '';
        this.statusCode = 200;
        this.error = null;
    }

    static Success<T>(objVal: T, statusCode: StatusCode = StatusCode.OK,isSuccess: boolean = true, message: string|null = ''):GenResponse<T>{
        const objResp = new GenResponse<T>();
        
        objResp.data = objVal;
        objResp.isSuccess = isSuccess;
        objResp.message = message;
        objResp.statusCode = statusCode;
        
        return objResp;
    }
    static Failed<T>(objVal: T, statusCode: StatusCode = StatusCode.OK,isSuccess: boolean = false, error: string|null = ''):GenResponse<T>{
        const objResp = new GenResponse<T>();
        
        objResp.data = objVal;
        objResp.isSuccess = isSuccess;
        objResp.error = error;
        objResp.statusCode = statusCode;
        
        return objResp;
    }
}


export enum StatusCode{
    OK = 200,
    Created=201,
    // NoChanges=304,
    BadRequest=400,
    Unauthorized=401,
    Forbidden=403,
    NotFound = 404,
    UnAvailableForLegalReasons=451,
    ServerError=500,
    NotImplemented=501,
    ServiceNotAvailable=503,
    GatewayTimeout=504,
    InsufficientStorage=507
}


export default GenResponse;


export const GenResponseSchema = (dataSchema: any) => ({
  type: "object",
  properties: {
    isSuccess: { type: "boolean" },
    data: dataSchema ?? { type: "null" },
    message: { type: "string", nullable: true },
    statusCode: { type: "number" },
    error: { type: "string", nullable: true }
  },
//   required: ["isSuccess", "statusCode"]
});
