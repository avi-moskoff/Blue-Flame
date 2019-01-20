import ThermalCamera from "./thermalCamera";
import { Pane3D } from "./3d";
import SensorData from "./sensorData"
import IrCam from "./irCam";

export default function handleData(imageSrc: string, json: SensorData, temperature: IrCam, thermalCamera: ThermalCamera, pane3d: Pane3D) {
	let array = temperature.thermalarray
	
	pane3d.setBoardRotation(json.orientation.y * Math.PI / 180, json.orientation.x * Math.PI / 180, json.orientation.z * Math.PI / 180)
	thermalCamera.setThermalData(array)

	function clamp(num, a, b) {
		return Math.min(Math.max(a, num), b)
	}

	// raw ass javascript because i'm a criminal
	let tempValue = clamp(Math.ceil((5 - 1) / (35 - 20) * json.temperature.temperature - 4), 1, 5)
	let flameValue = clamp(Math.ceil((3 - 1) / (200 - 50) * json.gas.tvoc - 1 / 3), 1, 5)
	let cloudValue = clamp(Math.floor((2 - 1) / (430 - 400) * json.gas.eco2 - 12.3333333333), 1, 5)
	let lightbulbValue = clamp(Math.ceil((6.5 - 1) / (0 - Math.pow(2, 16)) * json.proximity.ambientlight) + 5, 1, 5)
	let proximityValue = clamp(Math.ceil((3 - 1) / (Math.pow(2, 16) - 0) * (json.proximity.proximity + Math.pow(2, 16) / 10)), 1, 4)

	document.getElementById("temp").style.backgroundImage = `url(./data/icons2/temp${tempValue}.png)`
	document.getElementById("flame").style.backgroundImage = `url(./data/icons2/flame${flameValue}.png)`
	document.getElementById("cloud").style.backgroundImage = `url(./data/icons2/cloud${cloudValue}.png)`
	document.getElementById("lightbulb").style.backgroundImage = `url(./data/icons2/lightbulb${lightbulbValue}.png)`
	document.getElementById("proximity").style.backgroundImage = `url(./data/icons2/proximity${proximityValue}.png)`

	let image = document.getElementById("image") as HTMLImageElement
	image.src = imageSrc
}