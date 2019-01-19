import ThermalCamera from "./thermalCamera";
import { Pane3D } from "./3d";

interface SensorData {
	gas: {
		eco2: number,
		tvoc: number
	},
	orientation: {
		x: number, // yaw
		y: number, // pitch
		z: number // roll
	},
	proximity: {
		proximity: number,
		ambientlight: number
	},
	temperature: {
		temperature: number
	},
	timestamp: number
}

export default function handleData(json: SensorData, temperature: any[][], thermalCamera: ThermalCamera, pane3d: Pane3D) {
	pane3d.setBoardRotation(json.orientation.y * Math.PI / 180, json.orientation.x * Math.PI / 180, json.orientation.z * Math.PI / 180)
	thermalCamera.setThermalData(temperature)
}