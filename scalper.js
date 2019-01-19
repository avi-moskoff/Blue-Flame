const http = require('http');
const fs = require('fs');

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
							}
							catch(error) {
								console.log("caught error trying to process\n")
								resolve()
							}
							bufferData.timestamp = Date.now()
							
							var jsonObject = JSON.parse(jsonData) // should be an array
							console.log(`Found ${jsonObject.length} entries of existing data for ${filePath}, adding new response to file...`)
							jsonObject.push(bufferData)
						}
						else {
							let bufferData = JSON.parse(buffer)
							bufferData.timestamp = Date.now()

							var jsonObject = [bufferData]
						}
		
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
		console.log("\n\nNew tick...")
		await downloadJSON("http://192.168.0.3/gps.json", "./data/gps.json") // get gps data
		await downloadJSON("http://192.168.0.3/localsensors.json", "./data/localsensors.json") // various sensor data, like temp and air pressure
		await downloadJSON("http://192.168.0.3/ircam.json", "./data/ircam.json") // thermal cam
		
		await sleep(1000) // wait 1 second, to wait for data update
	}
}

main()