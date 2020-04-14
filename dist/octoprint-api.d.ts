import { IPrinterStatus, ICamera } from './interfaces';
export declare class OctoprintApi {
    apiKey: string;
    apiPath: string;
    constructor(key: string, path: string);
    getVersion(): Promise<any>;
    getStatus(): Promise<IPrinterStatus>;
    private _getTools;
    getSettings(): Promise<any>;
    getCameras(): Promise<ICamera[]>;
    getCamera(cameraId: number): Promise<ICamera>;
    getJobInfo(): Promise<any>;
    private buildGetRequest;
}
