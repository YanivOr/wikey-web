const WS_URL = 'ws://localhost:3000'

let ws
let connectBtn, messagesArea, statusBlock, statusArea, clearBtn

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
    
    const id = idInput.value
    const client = clientSelect.value

    ws.send(JSON.stringify({
      client,
      command: 'init',
      value: id,
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
  clientSelect = document.querySelector('.inputs-block select')
  idInput = document.querySelector('.id-input')
  connectBtn = document.querySelector('.buttons-block .connection')
  clearBtn = document.querySelector('.message-block .messages-header .clear-btn')
  statusBlock = document.querySelector('.buttons-block .status-block')
  statusArea = document.querySelector('.buttons-block .status-block .status')
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

  clearBtn.addEventListener('click', () => {
    messagesArea.value = ''
  })
})