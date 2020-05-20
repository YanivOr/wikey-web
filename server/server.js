const websocket = require('ws')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const wss = new websocket.Server({ server })
app.on('upgrade', wss.handleUpgrade)

const deviceId = '123456';

server.listen(3000, () => {
  console.log('server started on PORT 3000')
})

wss.on('connection', socket => {
  socket.send('web socket connection is alive')

  socket.on('message', function(data){
    const parsedData = JSON.parse(data)
    console.log(parsedData)

    /*
    const msg = messagesHandler(parsedData)
    if (msg) {
      socket.send(msg)
      console.log(msg)
    }
    */
  })
})

const messagesHandler = (data) => {
  switch (data) {
    case 'ping':
      return 'pong';
    default:
      break;
  }
} 