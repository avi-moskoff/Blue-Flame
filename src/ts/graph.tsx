import * as React from "react"

import * as ReactChart from 'react-chartjs-2'

class state {
    date: Date
}

interface properties {
	graphName: string,
	unitName: string
}

export default class Graph extends React.Component<properties, state> {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    render() {
        return (
            <div>
                <ReactChart.Line data={{
                    labels: ['0','1','2', '3', '4'],
					datasets: [{
						label: this.props.graphName,
						fill: false,
						borderColor: "rgb(110, 212, 251)",
						backgroundColor: "rgba(0, 0, 0, 0)",
						pointBackgroundColor: "rgb(110, 212, 251)",
						pointBorderColor: "rgb(110, 212, 251)",
						pointHoverBackgroundColor: "rgb(110, 212, 251)",
						pointHoverBorderColor: "rgb(110, 212, 251)",
						data: [1, 2, 3, 20, 10]
					 }]
                }} height={106} options={{
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					tooltips: {
						callbacks: {
							label: (item) => `${item.yLabel} ${this.props.unitName}`,
						},
					},
					scales:{
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
}
