import * as React from "react"
import * as ReactDOM from "react-dom"
import { Data } from "./data";
import handleData from "./handleData";
import { Pane3D } from "./3d";
import ThermalCamera from "./thermalCamera";
import Graph from "./graph";


function fancyInterpolation(percent, ranges) {
	for(let range of ranges) {
		if(percent < range.limit) {
			let fakePercent = percent / range.limit
			// return the interpolated value
			return (range.max - range.min) * fakePercent + range.min
		}
	}

	return undefined
}

// peacewise lerping:
/*
	[{
		min: 23875932,
		max: 23895243, 
		limit: 0.25
	}, {
		min: 3589135,
		max: 1389531289,
		limit: 0.5
	}]
*/

interface props {
	pane: Pane3D,
	thermal: ThermalCamera,
	temperatueGraph: Graph,
	tvocGraph: Graph,
	lightGraph: Graph,
	co2Graph: Graph,
	proximityGraph: Graph
}

export default class Timeline extends React.Component<props> {
	private autoCurrentTime: number = 0
	private autoDirection: number = 1
	private autoStep: number = 0.005 // 0.5%
	private autoTickActive: boolean = false
	private data: Data = new Data()
	
	
	
	constructor(props) {
		super(props)

		this.autoTick()
	}

	public render(): JSX.Element {
		return <div><input type="range" ref="range" className="timeline" min={0} max={10000} step={10} onChange={this.onRangeChange.bind(this)}></input><br />
			<div style={{
				textAlign: "center"
			}}>
				Timeline (drag to view history)
			</div>
			
			{/* play/pause buttons */}
			<div style={{
				textAlign: "center"
			}}>
				<div className="playButton" ref="playButton" onClick={this.onPlayPressed.bind(this)}>
					<img src="./data/icons2/play.svg" style={{ width: "100%" }} />
				</div>

				<div className="pauseButton" ref="pauseButton" onClick={this.onPausePressed.bind(this)} style={{ display: "none" }}>
					<img src="./data/icons2/pause.svg" style={{ width: "100%" }} />
				</div>
			</div>
		</div>
	}

	private onPlayPressed(): void {
		let playButton = ReactDOM.findDOMNode(this.refs.playButton) as HTMLElement
		let pauseButton = ReactDOM.findDOMNode(this.refs.pauseButton) as HTMLElement

		playButton.style.display = "none"
		pauseButton.style.display = "block"

		this.setAutoTickActive(true)
	}

	private onPausePressed(): void {
		let playButton = ReactDOM.findDOMNode(this.refs.playButton) as HTMLElement
		let pauseButton = ReactDOM.findDOMNode(this.refs.pauseButton) as HTMLElement

		playButton.style.display = "block"
		pauseButton.style.display = "none"

		this.setAutoTickActive(false)
	}

	// called when the range is changed
	private onRangeChange(event: React.ChangeEvent<HTMLInputElement>): void {
		let value = parseInt(event.target.value)
		this.setTime(value / 10000)
	}

	// time is in percent, 100% == present time
	private setTime(time: number, applyToRange: boolean = false): void {
		if(applyToRange) {
			let range = ReactDOM.findDOMNode(this.refs.range) as HTMLInputElement
			range.value = `${time * 10000}`
		}

		let unixTime = this.data.percentToTimestamp(time)

		let tempData = this.data.getIrCam(unixTime)
		let sensorData = this.data.getSensorData(unixTime)
		handleData("", sensorData, tempData, this.props.thermal, this.props.pane)

		let sensorArray = this.data.getSensorDataArray(unixTime)
		// build various array values
		let temperatureArray = []
		let tvocArray = []
		let lightArray = []
		let co2Array = []
		let proximityArray = []
		for(let data of sensorArray) {
			temperatureArray.push(data.temperature.temperature)
			tvocArray.push(data.gas.tvoc)
			lightArray.push(data.proximity.ambientlight)
			co2Array.push(data.gas.eco2)
			proximityArray.push(data.proximity.proximity)
		}

		this.props.temperatueGraph.setData(temperatureArray)
		this.props.tvocGraph.setData(tvocArray)
		this.props.lightGraph.setData(lightArray)
		this.props.co2Graph.setData(co2Array)
		this.props.proximityGraph.setData(proximityArray)
	}

	// when called, automatically increments the timeline forwards by a certain amount per second
	private autoTick(): void {
		if(this.autoTickActive) {
			this.autoCurrentTime += this.autoStep * this.autoDirection

			// make the auto timeline bounce off of the limits
			if(this.autoCurrentTime >= 1) {
				this.autoCurrentTime = 1
				this.autoDirection = -1
			}
			else if(this.autoCurrentTime <= 0) {
				this.autoCurrentTime = 0
				this.autoDirection = 1
			}
			
			this.setTime(this.autoCurrentTime, true)
		}
		
		setTimeout(() => {
			this.autoTick()
		}, 1000)
	}

	// sets whether or not the autotick is active
	private setAutoTickActive(input: boolean): void {
		this.autoTickActive = input
	}
}