import ThermalCamera from "./thermalCamera";
import { Pane3D } from "./3d";
import SensorData from "./sensorData"

export default function handleData(json: SensorData, temperature: any[][], thermalCamera: ThermalCamera, pane3d: Pane3D) {
	pane3d.setBoardRotation(json.orientation.y * Math.PI / 180, json.orientation.x * Math.PI / 180, json.orientation.z * Math.PI / 180)
	thermalCamera.setThermalData(temperature)

	// raw ass javascript because i'm a criminal
	let tempValue = Math.ceil((5 - 1) / (35 - 20) * json.temperature.temperature - 4)
	let flameValue = Math.ceil((3 - 1) / (200 - 50) * json.gas.tvoc - 1 / 3)
	let cloudValue = Math.floor((2 - 1) / (430 - 400) * json.gas.eco2 - 12.3333333333)
	let lightbulbValue = Math.ceil((5 - 1) / (Math.pow(2, 16) - 0) * (json.proximity.proximity + Math.pow(2, 16) / 10))
	let proximityValue = Math.ceil((3 - 1) / (Math.pow(2, 16) - 0) * (json.proximity.proximity + Math.pow(2, 16) / 10))

	document.getElementById("temp").style.backgroundImage = `url(./data/icons2/temp${tempValue}.png)`
	document.getElementById("flame").style.backgroundImage = `url(./data/icons2/flame${flameValue}.png)`
	document.getElementById("cloud").style.backgroundImage = `url(./data/icons2/cloud${cloudValue}.png)`
	document.getElementById("lightbulb").style.backgroundImage = `url(./data/icons2/lightbulb${lightbulbValue}.png)`
	document.getElementById("proximity").style.backgroundImage = `url(./data/icons2/proximity${proximityValue}.png)`
}