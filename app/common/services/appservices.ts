import CommonService from "./common-service";

interface IAppServices {
    commonService: CommonService;
}


export const appServices: IAppServices = {
    commonService: new CommonService(),
};
