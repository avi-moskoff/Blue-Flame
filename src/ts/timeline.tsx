import * as React from "react"
import * as ReactDOM from "react-dom"

export default class Timeline extends React.Component {
	private autoCurrentTime: number = 0
	private autoDirection: number = 1
	private autoStep: number = 0.005 // 0.5%
	private autoTickActive: boolean = false
	
	
	
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
		let value = event.target.value
		this.setTime(0)
	}

	// time is in percent, 100% == present time
	private setTime(time: number, applyToRange: boolean = false): void {
		if(applyToRange) {
			let range = ReactDOM.findDOMNode(this.refs.range) as HTMLInputElement
			range.value = `${time * 10000}`
		}
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