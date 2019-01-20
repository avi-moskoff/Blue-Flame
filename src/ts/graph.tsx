import * as React from "react"

import * as ReactChart from 'react-chartjs-2'

interface state {
	date: Date,
	data: number[]
}

interface properties {
	graphName: string,
	unitName: string
}

export default class Graph extends React.Component<properties, state> {
	private labels: string[]

	
	
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			data: []
		};

		this.labels = []
		for(let i = 0; i < 50; i++) {
			this.labels.push(`${i}`)
		}
	}

	render() {
		return (
			<div>
				<ReactChart.Line data={{
					labels: this.labels,
					datasets: [{
						label: this.props.graphName,
						fill: false,
						borderColor: "rgb(110, 212, 251)",
						backgroundColor: "rgba(0, 0, 0, 0)",
						pointBackgroundColor: "rgb(110, 212, 251)",
						pointBorderColor: "rgb(110, 212, 251)",
						pointHoverBackgroundColor: "rgb(110, 212, 251)",
						pointHoverBorderColor: "rgb(110, 212, 251)",
						data: this.state.data
					}]
				}} height={106} options={{
					title: {
						display: true,
						text: `${this.props.graphName} (${this.props.unitName})`,
						fontFamily: "Open Sans"
					},
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						callbacks: {
							label: (item) => `${item.yLabel} ${this.props.unitName}`,
							title: (item) => this.props.graphName
						},
					},
					scales: {
						xAxes: [{
							display: false
						}],
						yAxes: [{
							display: false
						}]
					},
					layout: {
						padding: 10
					}
				}} />
			</div>
		);
	}

	public setData(data: number[]): void {
		this.setState({
			data: data
		})
	}
}
