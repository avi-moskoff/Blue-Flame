import * as ReactDOM from "react-dom"
import * as React from "react"
import { Pane3D } from "./3d"
import ThermalCamera from "./thermalCamera";
import handleData from "./handleData";
import Graph from "./graph"
import Timeline from "./timeline";

let pane = ReactDOM.render(<Pane3D></Pane3D>, document.getElementById("pane3D")) as Pane3D

let thermal = ReactDOM.render(<ThermalCamera></ThermalCamera>, document.getElementById("thermalCamera")) as ThermalCamera

let temperatureGraph = ReactDOM.render(<Graph graphName="Temperature" unitName="Celcius"></Graph>, document.getElementById("tempGraph")) as Graph
let tvocGraph = ReactDOM.render(<Graph graphName="TVOC" unitName="PPB"></Graph>, document.getElementById("flameGraph")) as Graph
let lightGraph = ReactDOM.render(<Graph graphName="Light" unitName="Units"></Graph>, document.getElementById("lightbulbGraph")) as Graph
let co2Graph = ReactDOM.render(<Graph graphName="CO2 Level" unitName="PPM"></Graph>, document.getElementById("cloudGraph")) as Graph
let proximityGraph = ReactDOM.render(<Graph graphName="Proximity" unitName="Units"></Graph>, document.getElementById("proximityGraph")) as Graph

ReactDOM.render(<Timeline pane={pane} thermal={thermal} temperatueGraph={temperatureGraph} tvocGraph={tvocGraph} lightGraph={lightGraph} co2Graph={co2Graph} proximityGraph={proximityGraph}></Timeline>, document.getElementById("timeline")) as Timeline

/*setTimeout(() => {
	handleData({
		"gas": {
			"eco2": 439, // co2
			"tvoc": 50 // flamable gas
		},
		"orientation": {
			"x": 64.62,
			"y": 0.31,
			"z": -3.44
		},
		"proximity": {
			"proximity": 2188,
			"ambientlight": 2829
		},
		"temperature": {
			"temperature": 23.71
		},
		"timestamp": 1547876973421
	}, [[0, 0, 0.5, 0, 0, 0, 0, 128], [30.03, 30.03, 31.53, 30.34, 30.34, 30.34, 30.34, 30.03], [30.34, 31.53, 31.53, 30.03, 30.03, 31.28, 31.28, 30.03], [30.03, 30.03, 30.03, 31.78, 31.78, 30.03, 30.03, 30.34], [30.03, 31.78, 30.34, 31.28, 31.28, 31.53, 31.28, 30.34], [31.28, 31.53, 31.53, 31.78, 31.28, 31.28, 30.03, 31.28], [31.28, 30.03, 30.03, 31.28, 30.03, 31.28, 30.03, 30.03], [30.09, 31.28, 31.28, 31.28, 31.53, 30.03, 30.09, 30.34]], thermal, pane)
}, 100)*/


/*
	when proximity sensor returns a close distance, then highlight this in the timeline so we can see if there's a person standing in front of the sensor or not
*/