import * as React from "react"

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
		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let color = (1 - this.state.thermalData[x][y] / 40) * 255
				elements.push(<div className="thermalBlock" key={elementKey} style={{
					backgroundColor: `rgb(${color}, ${color}, ${color})`
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
}