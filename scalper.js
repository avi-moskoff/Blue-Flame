// written by Jacob Watson

const http = require('http');
const fs = require('fs');

function shouldExit() {
	return fs.existsSync("./1.txt")
}

async function downloadJSON(url, filePath) {
	console.log(`Requesting data from ${url}, saving to ${filePath}...`)
	
	return new Promise((resolve, reject) => {
		let request = http.get(url, (response) => {
			let buffer = ""
			response.on("data", (data) => {
				buffer += data
			})
			
			response.on("end", () => {
				if(buffer) {
					fs.readFile(filePath, (error, jsonData) => {
						if(jsonData != undefined) {
							try {
								var bufferData = JSON.parse(buffer)
								bufferData.timestamp = Date.now()

								if(bufferData.gas && bufferData.gas.tvoc) {
									console.log(`TVOC CHECK VALUE: ${bufferData.gas.tvoc}`)
								}
								else if(bufferData.thermalarray) {
									console.log(`TEMP CHECK VALUE: ${bufferData.thermalarray[4][5]}`)
								}
							
								var jsonObject = JSON.parse(jsonData) // should be an array
								console.log(`Found ${jsonObject.length} entries of existing data for ${filePath}, adding new response to file...`)
								jsonObject.push(bufferData)
							}
							catch(error) {
								console.log("caught error trying to process\n")
								resolve()
							}
						}
						else {
							let bufferData = JSON.parse(buffer)
							bufferData.timestamp = Date.now()

							var jsonObject = [bufferData]
						}
		
						if(jsonObject != undefined) {
							// write new jsonObject to the file
							fs.writeFile(filePath, JSON.stringify(jsonObject), (error) => {
								if(error != undefined) {
									console.log("Had scalping error:\n", error)
								}
								else {
									console.log(`Successfully added data to ${filePath}\n`)
								}
			
								resolve()
							})
						}
					})
				}
				else {
					console.log("Error reading buffer...\n")
					resolve()
				}
			})
		}).end()

		request.on("error", (error) => {
			console.log(`Had error trying to download from ${url}\n`)
			resolve()
		})
	})
}

async function sleep(miliseconds) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, miliseconds)
	})
}

async function main() {
	while(true) {
		if(shouldExit()) {
			process.exit()
		}
		
		console.log("\n\nNew tick...")
		await downloadJSON("http://192.168.0.3/gps.json", "./data/gps.json") // get gps data
		await downloadJSON("http://192.168.0.3/localsensors.json", "./data/localsensors.json") // various sensor data, like temp and air pressure
		await downloadJSON("http://192.168.0.3/ircam.json", "./data/ircam.json") // thermal cam
		
		await sleep(1000) // wait 1 second, to wait for data update
	}
}

main()