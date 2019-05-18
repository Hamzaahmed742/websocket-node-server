const http = require("http")
const static = require("node-static")
const crypto = require("crypto")

const file  = new static.Server("./")
const server = http.createServer((req, res) => {
	req.addListener('end', () => file.serve(req, res)).resume()
})


server.on('upgrade', (req, socket) => {
	console.log(req.headers)
	if(req.headers['upgrade'] !== 'websocket') {
		socket.end('HTTP/1.1 400 Bad Request');
		return
	}

	const acceptKey = req.headers['sec-websocket-key']
	const protocol = req.headers['sec-websocket-protocol']
	const protocols = !protocols ? [] : protocol.split(",").map(s => s.trim())
	const responseHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${generateAcceptValue(acceptKey)}` ]
	if (protocols.includes('json')) {
		responseHeaders.push('Sec-WebSocket-Protocol: json')
	}
	socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')
})


const generateAcceptValue = (acceptKey) => {
	return crypto.createHash('sha1')
	.update(acceptKey + '258EAFA5-E914–47DA-C5AB0DC85B11', 'binary')
	.digest('base64')
}

const port = 3210
server.listen(port, console.log(`Server running at http://localhost:${port}`))