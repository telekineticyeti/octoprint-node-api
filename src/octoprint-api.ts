import {has} from 'ramda';
import fetch from 'cross-fetch';
import url from 'url';

export class OctoprintApi {
  public apiKey: string;
  public apiPath: string;

  constructor(key: string, path: string) {
    this.apiKey = key;
    this.apiPath = path;
  }

  public async getVersion(): Promise<any> {
    const request = this.buildGetRequest('version');

    return await fetch(request.url, request.options)
      .then(response => response)
      .catch(error => error);
  }

  public getStatus(): Promise<IPrinterStatus> {
    const request = this.buildGetRequest('printer?history=false,exclude=sd');
    return new Promise((resolve, reject) => {
      fetch(request.url, request.options)
        .then(async response => {
          const responseObj = await response.json();
          const tools = this.getTools(responseObj.temperature);

          const status: IPrinterStatus = {
            flags: {
              cancelling: responseObj.state.flags.cancelling,
              closedOrError: responseObj.state.flags.closedOrError,
              error: responseObj.state.flags.error,
              finishing: responseObj.state.flags.finishing,
              operational: responseObj.state.flags.operational,
              paused: responseObj.state.flags.paused,
              pausing: responseObj.state.flags.pausing,
              printing: responseObj.state.flags.printing,
              ready: responseObj.state.flags.ready,
              resuming: responseObj.state.flags.resuming,
            },
            text: responseObj.state.text,
            tools,
            bed: {
              targetTemp: responseObj.temperature.bed.target,
              actualTemp: responseObj.temperature.bed.actual,
              offset: responseObj.temperature.bed.offset,
            },
          };
          resolve(status);
        })
        .catch(error => reject(error));
    });
  }

  public getTools(data: any): IPrinterTool[] {
    const tools: IPrinterTool[] = [];

    const retrieveTool = (toolNumber: number = 0): void => {
      const toolName = `tool${toolNumber}`;
      const hasTool = has(toolName);

      if (hasTool(data)) {
        tools.push({
          name: toolName,
          targetTemp: data[toolName].target,
          actualTemp: data[toolName].actual,
          offset: data[toolName].offset,
        });
        retrieveTool(toolNumber + 1);
      }
    };
    retrieveTool();
    return tools;
  }

  public async getSettings(): Promise<any> {
    const request = this.buildGetRequest('settings');

    return await fetch(request.url, request.options)
      .then(response => response)
      .catch(error => error);
  }

  public getCameras(): Promise<ICamera[]> {
    const request = this.buildGetRequest('settings');

    return new Promise((resolve, reject) => {
      fetch(request.url, request.options)
        .then(async response => {
          const responseObj = await response.json();

          const hasMulticamPlugin = has('multicam');
          const cameras: ICamera[] = [];

          if (hasMulticamPlugin(responseObj.plugins)) {
            responseObj.plugins.multicam.multicam_profiles.forEach((camera: any) => {
              const cam = url.parse(camera.URL);
              cameras.push({
                name: camera.name,
                url: cam.hostname ? camera.URL : `${this.apiPath}${camera.URL}`,
              });
            });
          } else {
            cameras.push({
              name: 'default',
              url: responseObj.webcam.snapshotUrl,
            });
          }
          resolve(cameras);
        })
        .catch(error => reject(error));
    });
  }

  public getCamera(cameraId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (isNaN(cameraId)) {
        reject('Invalid camera ID - must be a integer');
        return;
      }

      this.getCameras().then(r => {
        if (!r.length || cameraId > r.length) {
          reject('Invalid camera ID. No camera exists with that index.');
          return;
        }
        resolve(r[cameraId]);
      });
    });
  }

  /**
   * Build a get request options object to query the octoprint api
   * @param path Api path to query
   */
  private buildGetRequest(path: string): IOctoprintGetRequest {
    return {
      url: `${this.apiPath}/api/${path}`,
      options: {
        headers: {
          'X-Api-Key': `${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    };
  }
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
