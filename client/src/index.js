const WS_URL = 'ws://128.199.37.116:8000'

let ws
let
  typeSelect,
  deviceIdBlock,
  deviceIdInput,
  operatorIdBlock,
  operatorIdInput,
  connectBtn,
  actionsWrapper,
  gpioBlock,
  gpioBtn,
  gpioPin,
  gpioHighLow,
  pulseBlock,
  pulseBtn,
  pulsePin,
  pulseHighLow,
  pulseFreq,
  pulseAmount,
  stringBlock,
  stringBtn,
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
  ws.onopen = () => {
    connectionHandler(true)
    
    const type = typeSelect.value

    const data = {
      id: type === 'device' ? deviceIdInput.value : operatorIdInput.value,
      type,
      command: 'INIT',
    }

    if (type === 'device') {
      ws.send(JSON.stringify(data))
    } else if (type === 'operator') {
      data.device = deviceIdInput.value
      ws.send(JSON.stringify(data))
    }
  }

  ws.onmessage = (e) => {
    messagesArea.value += `${e.data}\r\n`
  }

  ws.onerror = (e) => {
    messagesArea.value += `Error: ${e.data}\r\n`
  }

  ws.onclose = () => {
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
  actionsWrapper = document.querySelector('.actions-wrapper')
  gpioBlock = document.querySelector('.gpio-block')
  gpioBtn = gpioBlock.querySelector('button')
  gpioPin = gpioBlock.querySelector('.pin')
  gpioHighLow = gpioBlock.querySelector('.high-low')
  pulseBlock = document.querySelector('.pulse-block')
  pulseBtn = pulseBlock.querySelector('button')
  pulsePin = pulseBlock.querySelector('.pin')
  pulseHighLow = pulseBlock.querySelector('.high-low')
  pulseFreq = pulseBlock.querySelector('.freq')
  pulseAmount = pulseBlock.querySelector('.amount')
  stringBlock = document.querySelector('.string-block')
  stringBtn = stringBlock.querySelector('button')
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

  clearBtn.addEventListener('click', () => {
    messagesArea.value = ''
  })

  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'device') {
      actionsWrapper.style.display = 'none'
    } else {
      actionsWrapper.style.display = 'block'
    }
  })

  gpioBtn.addEventListener('click', () => {
    const pin = gpioPin.value
    const val = gpioHighLow.value

    if (!pin || !val) {
      return
    }

    const data = {
      id: operatorIdInput.value,
      type: typeSelect.value,
      device: deviceIdInput.value,
      command: 'GPIO',
      data: {
        pin,
        val,
      }
    }

    ws.send(JSON.stringify(data))
  })

  pulseBtn.addEventListener('click', () => {
    const pin = pulsePin.value
    const startAs = pulseHighLow.value
    const freq = pulseFreq.value
    const amount = pulseAmount.value

    if (!pin || !startAs || !freq || !amount) {
      return
    }

    const data = {
      id: operatorIdInput.value,
      type: typeSelect.value,
      device: deviceIdInput.value,
      command: 'PULSE',
      data: {
        pin,
        startAs,
        freq,
        amount,
      }
    }

    ws.send(JSON.stringify(data))
  })

  stringBtn.addEventListener('click', () => {
    const val = stringInput.value

    if (!val) {
      return
    }

    const data = {
      id: operatorIdInput.value,
      type: typeSelect.value,
      device: deviceIdInput.value,
      command: 'STR',
      data: {
        val,
      }
    }

    ws.send(JSON.stringify(data))
  })

  pingBtn.addEventListener('click', () => {
    const data = {
      id: operatorIdInput.value,
      type: typeSelect.value,
      device: deviceIdInput.value,
      command: 'PING',
    }

    ws.send(JSON.stringify(data))
  })
})
