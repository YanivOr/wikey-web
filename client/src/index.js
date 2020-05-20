const WS_URL = 'ws://localhost:3000'

let ws
let 
  typeSelect,
  deviceIdBlock,
  operatorIdBlock,
  deviceIdInput,
  operatorIdInput,
  connectBtn,
  clearBtn,
  messagesArea

const connectionHandler = (connected) => {
  if(connected) {
    connectBtn.classList.add('connected')
    connectBtn.classList.remove('disconnected')
    connectBtn.innerText = 'DISCONNECT'
  }
  else {
    connectBtn.classList.add('disconnected')
    connectBtn.classList.remove('connected')
    connectBtn.innerText = 'CONNECT'
  }
}

const socketHandler = () => {
  ws.onopen = function () {
    connectionHandler(true)
    
    const type = typeSelect.value

    const data = {
      id: type === 'device' ? deviceIdInput.value : operatorIdInput.value,
      type,
      command: 'init',
    }

    if (type === 'device') {
      ws.send(JSON.stringify(data))
    } else if (type === 'operator') {
      data.device = deviceIdInput.value
      ws.send(JSON.stringify(data))
    }
  }

  ws.onmessage = function (e) {
    messagesArea.value += `${e.data}\r\n`
  }

  ws.onerror = function (e) {
    messagesArea.value += `Error: ${e.data}\r\n`
  }

  ws.onclose = function () {
    connectionHandler(false)
    ws = null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  typeSelect = document.querySelector('.inputs-block select')
  deviceIdBlock = document.querySelector('.device-id-block')
  operatorIdBlock = document.querySelector('.operator-id-block')
  deviceIdInput = deviceIdBlock.querySelector('input')
  operatorIdInput = operatorIdBlock.querySelector('input')
  connectBtn = document.querySelector('.buttons-block .connection')
  pingBtn = document.querySelector('.buttons-block .ping')
  clearBtn = document.querySelector('.message-block .messages-header .clear-btn')
  messagesArea = document.querySelector('.message-block .messages')

  connectBtn.addEventListener('click', () => {
    if(connectBtn.classList.contains('disconnected')) {
      ws = new WebSocket(WS_URL)
      socketHandler()
    }
    else {
      ws.close()
    }
  })

  pingBtn.addEventListener('click', () => {
    const type = typeSelect.value

    const data = {
      id: operatorIdInput.value,
      type,
      command: 'ping',
      device: deviceIdInput.value
    }

    ws.send(JSON.stringify(data))
  })

  clearBtn.addEventListener('click', () => {
    messagesArea.value = ''
  })

  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'device') {
      operatorIdBlock.style.display = 'none'
      pingBtn.style.display = 'none'
    } else {
      operatorIdBlock.style.display = 'flex'
      pingBtn.style.display = 'inline'
    }
  })
})