const http = require('http')
const Stream = require('stream').Transform
const fs = require('fs')
const { performance } = require("perf_hooks")

async function downloadImage(url, filePath) {
	return new Promise((resolve, reject) => {
		let request = http.request(url, (response) => {
			let data = new Stream()
			let dataLength = response.headers["content-length"]
			let downloadedData = 0
			let lastChunk = 0

			response.on('data', (chunk) => {
				data.push(chunk)
				downloadedData += chunk.length

				if(performance.now() - lastChunk > 500) {
					console.log(`Downloaded chunk, ${downloadedData}/${dataLength}, ${Math.floor(downloadedData / dataLength * 100)}%`)
				}

				lastChunk = performance.now()
			})

			response.on('end', () => {
				console.log("Finished downloading")
				fs.writeFile(filePath, data.read(), (error) => {
					if(error != undefined) {
						console.log("Had image saving error error:\n", error)
					}
					else {
						console.log(`Successfully saved image to ${filePath}\n`)
					}

					resolve()
				})
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
		await downloadImage("http://192.168.0.3/camera.jpg", `./images/${Date.now()}.jpg`) // get gps data
		
		await sleep(1000) // wait 1 second, to wait for data update
	}
}

main()