const WS_URL = 'ws://localhost:3000'
const deviceId = '123456';

let ws
let connectBtn, messagesArea, statusBlock, statusArea, closeBtn, clearBtn

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
    
    const deviceId = idInput.value

    ws.send(JSON.stringify({
      client: 'operator',
      command: 'init',
      data: deviceId,
    }))
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
  connectBtn = document.querySelector('.buttons-block .connection')
  idInput = document.querySelector('.id-input')
  statusBlock = document.querySelector('.buttons-block .status-block')
  statusArea = document.querySelector('.buttons-block .status-block .status')
  closeBtn = document.querySelector('.buttons-block .status-block .close-btn')
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

  closeBtn.addEventListener('click', () => {
    statusBlock.style.display = 'none'
  })

  clearBtn.addEventListener('click', () => {
    messagesArea.value = ''
  })
})