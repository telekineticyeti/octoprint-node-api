# Octoprint API for node

This class provides methods for interacting with an Octoprint enabled 3D printer. You can retrieve the printer/tool status, as well as a list of cameras that have been enabled using the [Multicam plugin](https://github.com/mikedmor/OctoPrint_MultiCam).

### Example Usage

#### Get Status

```
import {OctoprintApi} from 'octoprint-api';

const octopi = new OctoprintApi(
  'YOUR_API_KEY', // Octoprint API key
  'http://192.168.1.100/', // network path to Octoprint enabled printer
);

octopi
  .getStatus()
  .then(res => console.log(res))
  .catch(error => console.error(error));


/** Console Output:
  * {
  *   flags: {
  *     cancelling: false,
  *     closedOrError: false,
  *     error: false,
  *     finishing: false,
  *     operational: true,
  *     paused: false,
  *     pausing: false,
  *     printing: false,
  *     ready: true,
  *     resuming: false
  *   },
  *   text: 'Operational',
  *   tools: [ { name: 'tool0', targetTemp: 0, actualTemp: 16.7, offset: 0 } ],
  *   bed: { targetTemp: 0, actualTemp: 16.9, offset: 0 }
  * }
  */

```

#### Get Cameras

```
import {OctoprintApi} from 'octoprint-api';

const octopi = new OctoprintApi(
  'YOUR_API_KEY', // Octoprint API key
  'http://192.168.1.100/', // network path to Octoprint enabled printer
);

octopi
  .getCameras()
  .then(res => console.log(res))
  .catch(error => console.error(error));

/** Console Output:
  * [
  * {
  *   name: 'ExtruderCam',
  *   url: 'http://192.168.1.240//webcam/?action=stream'
  * },
  * {
  *   name: 'Enclosure',
  *   url: 'http://192.168.1.230:8080/?action=stream'
  * },
  * {
  *   name: 'Beach',
  *   url: 'https://online.aberdeencity.gov.uk/services/Webcam/images/beach.jpg?dummy=1339681014'
  * }
  * ]
  */

```
