import IrCam from './irCam'
import SensorData from './sensorData'

import * as irCamJson from '../../dist/data/sensors/localsensors.json'
import * as sensorDataJson from '../../dist/data/sensors/ircam.json'

export class Data {
    irCam: IrCam[]

    sensorData: SensorData[]

    constructor() {
        this.irCam = <IrCam[]>irCamJson

        this.sensorData = <SensorData[]>sensorDataJson
    }

    getIrCam(timeStamp: number): IrCam {
        for (let i = 0; i < this.irCam.length; i++) {
            if (this.irCam[i].timestamp >= timeStamp) {
                return this.irCam[i]
            }
        }
    }

    getIrCamArray(timeStamp: number): IrCam[] {
        let lowerBound = timeStamp < 50 ? 0 : timeStamp - 50
        let upperBound = timeStamp + 50 > this.irCam.length ? this.irCam.length : timeStamp + 50

        return this.irCam.slice(lowerBound, upperBound)
    }

    getSensorData(timeStamp: number): SensorData {
        for (let i = 0; i < this.irCam.length; i++) {
            if (this.sensorData[i].timestamp >= timeStamp) {
                return this.sensorData[i]
            }
        }
    }

    getSensorDataArray(timeStamp: number): SensorData[] {
        let lowerBound = timeStamp < 50 ? 0 : timeStamp - 50
        let upperBound = timeStamp + 50 > this.sensorData.length ? this.sensorData.length : timeStamp + 50

        return this.sensorData.slice(lowerBound, upperBound)
    }

}