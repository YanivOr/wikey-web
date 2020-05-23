const WS_URL = 'ws://localhost:3000'

let ws
let
  typeSelect,
  deviceIdBlock,
  deviceIdInput,
  operatorIdBlock,
  operatorIdInput,
  connectBtn,
  actionsBlock,
  gpioBlock,
  gpioButton,
  gpioPin,
  gpioHighLow,
  pulseBlock,
  pulseButton,
  pulsePin,
  pulseHighLow,
  stringBlock,
  stringButton,
  stringInput,
  pingBtn,
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
  deviceIdInput = deviceIdBlock.querySelector('input')
  operatorIdBlock = document.querySelector('.operator-id-block')
  operatorIdInput = operatorIdBlock.querySelector('input')
  connectBtn = document.querySelector('.connection')
  actionsBlock = document.querySelector('.actions-block')
  gpioBlock = document.querySelector('.gpio-block')
  gpioButton = gpioBlock.querySelector('button')
  gpioPin = gpioBlock.querySelector('.pin')
  gpioHighLow = gpioBlock.querySelector('.high-low')
  pulseBlock = document.querySelector('.pulse-block')
  pulseButton = pulseBlock.querySelector('button')
  pulsePin = pulseBlock.querySelector('.pin')
  pulseHighLow = pulseBlock.querySelector('.high-low')
  stringBlock = document.querySelector('.string-block')
  stringButton = stringBlock.querySelector('button')
  stringInput = stringBlock.querySelector('input')
  pingBtn = document.querySelector('.ping-block button')
  clearBtn = document.querySelector('.message-block .messages-header .clear-btn')
  messagesArea = document.querySelector('.message-block .messages')

  // fiil-up gpio options
  let gpioOptions = `<option value=""></option>`
  for (let i=0;i<17;i++) {
    gpioOptions += `<option value="${i}">${i}</option>`
  }
  gpioPin.innerHTML = gpioOptions
  pulsePin.innerHTML = gpioOptions

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
      actionsBlock.style.display = 'none'
    } else {
      actionsBlock.style.display = 'block'
    }
  })
})