import * as React from "react"

class RGBColor {
	public r: number
	public g: number
	public b: number



	constructor(r: number, g: number, b: number) {
		this.r = r
		this.g = g
		this.b = b
	}
}

interface ThermalProperties {
	thermalData: any[][]
}

export default class ThermalCamera extends React.Component<any, ThermalProperties> {
	constructor(props) {
		super(props)

		this.populateThermalData()
	}

	// initializes the thermal array
	public populateThermalData(): void {
		let array = []
		for(let i = 0; i < 8; i++) {
			array[i] = [0, 0, 0, 0, 0, 0, 0, 0]
		}

		this.state = {
			thermalData: array
		}
	}

	public render(): JSX.Element {
		let elements: JSX.Element[] = []
		let elementKey = 0

		// create blocks of thermal data, that will change color and shit
		for(let y = 0; y < 8; y++) {
			for(let x = 1; x < 8; x++) {
				let angle = (0.66 - 0) / (20 - 32) * this.state.thermalData[x][y] + 1.76

				// clamp value
				if(angle < 0) {
					angle = 0
				}
				else if(angle > 0.66) {
					angle = 0.66
				}

				let color = this.HSVtoRGB(angle, 1, 1)

				elements.push(<div className="thermalBlock" key={elementKey} style={{
					backgroundColor: `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`
				}}></div>)
				elementKey++
			}
		}
		
		return <div>{elements}</div>
	}

	public setThermalData(data: any[][]): void {
		this.setState({
			thermalData: data
		})
	}

	private HSVtoRGB(h: number, s: number, v: number): RGBColor {
		// do some linear interpolation trickery to find the RGB values based on this.h
		let hR = Math.max(0, Math.min(1, Math.abs(-6 * (h - 3 / 6)) - 1))  // max(0, min(1,  |-6 * (h - (3 / 6))| - 1))
		let hG = Math.max(0, Math.min(1, -Math.abs(-6 * (h - 2 / 6)) + 2)) // max(0, min(1, -|-6 * (h - (2 / 6))| + 2))
		let hB = Math.max(0, Math.min(1, -Math.abs(-6 * (h - 4 / 6)) + 2)) // max(0, min(1, -|-6 * (h - (4 / 6))| + 2))

		// calculate the saturiation modifier. how much color to add to the above calculated colors based on their saturation values
		let ffR = (-Math.abs(6 * (s - 3 / 6)) + 2) > 0 ? 1 : 0 // -|6 * (s - (3 / 6))| + 2
		let ffG = (Math.abs(6 * (s - 2 / 3)) - 1) > 0 ? 1 : 0  //  |6 * (s - (2 / 6))| - 1
		let ffB = (Math.abs(6 * (s - 4 / 6)) - 1) > 0 ? 1 : 0  //  |6 * (s - (4 / 6))| - 1
		// ffR, ffG, and ffB determine when we should apply saturation modifier to the final color. below are the saturation values we add to the final color. if saturation == 0, then we need to add the full amount of color remaining that lets the final color equal 1
		let sR = ((1 - hR) * (1 - s)) * ffR // ((1 - hR) * (1 - s)) * ffR
		let sG = ((1 - hG) * (1 - s)) * ffG // ((1 - hG) * (1 - s)) * ffG
		let sB = ((1 - hB) * (1 - s)) * ffB // ((1 - hB) * (1 - s)) * ffB

		// calculate the final color by adding together the old values and multiplying them by the brightness
		let r = (sR + hR) * v
		let g = (sG + hG) * v
		let b = (sB + hB) * v

		return new RGBColor(r, g, b)
	}
}