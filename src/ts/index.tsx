import * as ReactDOM from "react-dom"
import * as React from "react"
import { Pane3D } from "./3d"

ReactDOM.render(<Pane3D></Pane3D>, document.getElementById("pane3D"))

/*
	when proximity sensor returns a close distance, then highlight this in the timeline so we can see if there's a person standing in front of the sensor or not
*/