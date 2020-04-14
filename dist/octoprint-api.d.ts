export declare class OctoprintApi {
    apiKey: string;
    apiPath: string;
    constructor(key: string, path: string);
    getVersion(): Promise<any>;
    getStatus(): Promise<IPrinterStatus>;
    getTools(data: any): IPrinterTool[];
    getSettings(): Promise<any>;
    getCameras(): Promise<ICamera[]>;
    getCamera(cameraId: number): Promise<any>;
    private buildGetRequest;
}
export interface IOctoprintGetRequest {
    url: string;
    options: {
        headers: {
            [name: string]: string;
        };
    };
}
export interface IPrinterTool {
    name: string;
    targetTemp: number;
    actualTemp: number;
    offset: number;
}
export interface IPrinterStatus {
    flags: {
        cancelling: boolean;
        closedOrError: boolean;
        error: boolean;
        finishing: boolean;
        operational: boolean;
        paused: boolean;
        pausing: boolean;
        printing: boolean;
        ready: boolean;
        resuming: boolean;
    };
    text: string;
    tools: IPrinterTool[];
    bed: {
        targetTemp: number;
        actualTemp: number;
        offset: number;
    };
}
export interface ICamera {
    name: string;
    url: string;
}
