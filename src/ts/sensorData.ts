export default interface SensorData {
	gas: {
		eco2: number, // parts per million
		tvoc: number // parts per billion 
	},
	orientation: {
		x: number, // yaw
		y: number, // pitch
		z: number // roll
	},
	proximity: {
		proximity: number, // range from 0-2^16
		ambientlight: number // range from 0-2^16
	},
	temperature: {
		temperature: number // celcius
	},
	timestamp: number
}