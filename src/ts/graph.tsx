import * as React from "react"

import * as ReactChart from 'react-chartjs-2'

class state {
    date: Date
}

export default class Graph extends React.Component<any, state> {
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
                        data: [1, 2, 3, 20, 10]
                    }]
                }} />
            </div>
        );
    }
}
