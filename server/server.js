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
  socket.send('websocket connected')

  socket.on('message', function(data){
    const parsedData = JSON.parse(data)
    const msg = messagesHandler(socket, parsedData)

    if (msg) {
      socket.send(JSON.stringify(msg))
    }
  })
})

const messagesHandler = (socket, data) => {
  const { type } = data

  if (type === 'device') {
    return deviceHandler(socket, data)
  } else if (type === 'operator') {
    return operatorHandler(socket, data)
  }
}

const deviceHandler = (socket, {command, id}) => {
  if (command === 'init') {
    devices = {
      ...devices,
      [id]: {
        connected: true,
        socket,
      }
    }
  }
}

const operatorHandler = (socket, {command, device, id}) => {
  if (command === 'init') {
    if (!isDeviceExists(device)) {
      return {
        status: "error",
        value: "device does't exists",
      }
    }

    if (!isDeviceConnected(device)) {
      return {
        status: "error",
        value: "device is not connected",
      }
    }

    devices = {
      ...devices,
      [device]: {
        ...devices[device],
        operator: {
          id,
          socket,
        }
      }
    }
  } else if (command === 'ping') {
    const data = {
      message: 'ping'
    }
    devices[device].socket.ping();
    //devices[device].socket.send(JSON.stringify(data));
  }
}

const isDeviceExists = (device) => {
  return devices[device]
}

const isDeviceConnected = (device) => {
  return devices[device].connected
}