const websocket = require('ws')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const ws = new websocket.Server({ server })
app.on('upgrade', ws.handleUpgrade)

let devices = {}

server.listen(3000, () => {
  console.log('server started on PORT 3000')
})

ws.on('connection', socket => {
  socket.on('message', (data) =>{
    let parsedData = {}

    try {
      parsedData = JSON.parse(data)
    } catch (e) {
      console.log(`Invalid JSON: ${data}`)
    }
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
  if (command === 'INIT') {
    devices = {
      ...devices,
      [id]: {
        connected: true,
        socket,
      }
    }
  }
}

const operatorHandler = (socket, {device, id, command, data}) => {
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

  if (command === 'INIT') {
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
  } else if (command === 'GPIO') {
    devices[device].socket.send(JSON.stringify({
      command,
      data,
    }))
  } else if (command === 'PULSE') {
    devices[device].socket.send(JSON.stringify({
      command,
      data,
    }))
  } else if (command === 'STR') {
    devices[device].socket.send(JSON.stringify({
      command,
      data,
    }))
  } else if (command === 'PING') {
    devices[device].socket.ping()
  }
}

const isDeviceExists = (device) => {
  return devices[device]
}

const isDeviceConnected = (device) => {
  return devices[device].connected
}
