import IrCam from './irCam'
import SensorData from './sensorData'

import * as irCamJson from '../../dist/data/sensors/ircam.json'
import * as sensorDataJson from '../../dist/data/sensors/localsensors.json'
import * as imageJson from '../../dist/data/sensors/imageIndex.json'

export class Data {
	irCam: IrCam[]

    sensorData: SensorData[]
    
	image: number[]
	
	private lastImage: number = -1
	private maxTimestamp: number
	private minTimestamp: number

	constructor() {
		this.irCam = <IrCam[]>irCamJson

        this.sensorData = <SensorData[]>sensorDataJson
        
		this.image = <number[]>imageJson
		
		// finds a break in the data
		for(let i = 0; i < this.sensorData.length - 1; i++) {
			let test1 = this.sensorData[i].timestamp
			let test2 = this.sensorData[i + 1].timestamp

			if(test2 - test1 > 5 * 60 * 1000) {
				console.log(`found big break ${test1} ${test2} ${Math.abs(test1 - test2) / 1000 / 60} minutes`)
			}
		}
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
    
    public getClosestImage(timeStamp: number): number {
        for (let i = 0; i < this.image.length; i++) {
			if(this.image[i] >= timeStamp) {
				this.lastImage = this.image[i]
				return this.image[i]
			}
		}

		return this.lastImage
    }

	getSensorIndex(timeStamp: number): number {
		for (let i = 0; i < this.sensorData.length; i++) {
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
		// return this.irCam[this.irCam.length - 1].timestamp

		if(this.maxTimestamp == undefined) {
			this.maxTimestamp = -10000000
			for(let cam of this.sensorData) {
				if(cam.timestamp > this.maxTimestamp) {
					this.maxTimestamp = cam.timestamp
				}
			}
		}

		return this.maxTimestamp
	}

	public getMinTimestamp(): number {
		// return this.irCam[0].timestamp

		if(this.minTimestamp == undefined) {
			this.minTimestamp = 100000000000000
			for(let cam of this.sensorData) {
				if(cam.timestamp < this.minTimestamp) {
					this.minTimestamp = cam.timestamp
				}
			}
		}

		return this.minTimestamp
	}

	public percentToTimestamp(percent: number): number {
		return (this.getMaxTimestamp() - this.getMinTimestamp()) * percent + this.getMinTimestamp()
    }


}