console.log("websocket connection implementation")

const ws = new WebSocket('wss://echo.websocket.org')

ws.addEventListener('open', () => {
	ws.send('Hello!')
})

ws.addEventListener('message', event => {
	console.log("Received ", event.data)
})

ws.addEventListener('close', () => {
	console.log("Disconnected")
})

ws.addEventListener('error', event => {
	console.log("Error ", event.data)
})