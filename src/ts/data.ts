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

	getIrIndex(timeStamp: number): number {
		for (let i = 0; i < this.irCam.length; i++) {
			if (this.irCam[i].timestamp >= timeStamp) {
				return i
			}
		}
	}

	getIrCam(timeStamp: number): IrCam {
		return this.irCam[this.getIrIndex(timeStamp)]
	}

	getIrCamArray(timeStamp: number): IrCam[] {
		let index = this.getIrIndex(timeStamp)
		let lowerBound = index < 50 ? 0 : index - 50
		let upperBound = index + 50 > this.irCam.length ? this.irCam.length : index + 50

		return this.irCam.slice(lowerBound, upperBound)
	}

	getSensorIndex(timeStamp: number): number {
		for (let i = 0; i < this.irCam.length; i++) {
			if (this.sensorData[i].timestamp >= timeStamp) {
				return i
			}
		}
	}

	getSensorData(timeStamp: number): SensorData {
		return this.sensorData[this.getSensorIndex(timeStamp)]
	}

	getSensorDataArray(timeStamp: number): SensorData[] {
		let index = this.getSensorIndex(timeStamp)
		let lowerBound = index < 50 ? 0 : index - 50
		let upperBound = index + 50 > this.sensorData.length ? this.sensorData.length : index + 50

		return this.sensorData.slice(lowerBound, upperBound)
	}

	public getMaxTimestamp(): number {
		return this.irCam[this.irCam.length - 1].timestamp
	}

	public getMinTimestamp(): number {
		return this.irCam[0].timestamp
	}

	public percentToTimestamp(percent: number): number {
		return (this.getMaxTimestamp() - this.getMinTimestamp()) * percent + this.getMinTimestamp()
	}
}