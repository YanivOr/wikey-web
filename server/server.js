const websocket = require('ws')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const wss = new websocket.Server({ server })
app.on('upgrade', wss.handleUpgrade)

let devices = {};

server.listen(3000, () => {
  console.log('server started on PORT 3000')
})

wss.on('connection', socket => {
  socket.send('web socket connection is alive')

  socket.on('message', function(data){
    const parsedData = JSON.parse(data)
    console.log(parsedData)

    const msg = messagesHandler(parsedData)

    console.log(devices)

    /*
    if (msg) {
      socket.send(msg)
      console.log(msg)
    }
    */
  })
})

const messagesHandler = (data) => {
  const { client } = data

  if (client === 'device') {
    deviceHandler(data)
  } else if (client === 'operator') {
    operatorHandler(data)
  }
}

const deviceHandler = ({command, value}) => {
  if (command === 'init') {
    devices = {
      ...devices,
      [value]: {
        connected: true,
      }
    }
  }
}

const operatorHandler = ({command, value}) => {
  if (command === 'init') {
    devices = {
      ...devices,
      [value]: {
        ...devices[value],
        operator: 'test123456',
      }
    }
  }
}
