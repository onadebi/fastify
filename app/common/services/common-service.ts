import appsettings from "../config/appsettings";


export default class CommonService {

    error: string | null = null;
    appLoaded = false;

    LogError = (error: string, obj?: object | string | undefined) => {
        if (obj) {
            console.error(`[${appsettings.appName}] ERROR :`, error, obj);
        } else {
            console.error(`[${appsettings.appName}] ERROR :`, error);
        }
    }

    LogActivity = (prop: string | object, obj?: object | undefined) => {
        if (obj) {
            console.log(`[${appsettings.appName}] INFO :`, prop, obj);
        } else {
            console.info(`[${appsettings.appName}] INFO :`, prop);
        }
    }

    setServerError = (error: string) => {
        this.error = error;
    }


    setAppLoaded = () => {
        this.appLoaded = true;
    }

}