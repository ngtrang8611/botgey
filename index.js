const mineflayer = require('mineflayer')

// ====== CẤU HÌNH TÙY CHỈNH ======
const config = {
  host: 'vhoanghehe.aternos.me',
  port: 22693,
  username: 'BotCuaToi',
  
  // Đặt version là false để Mineflayer tự động nhận diện đúng phiên bản/protocol của server,
  // tránh xung đột KeepAlive Challenge khi chạy qua ViaVersion.
  version: false,

  jumpDelay: 3000,       // 3 giây nhảy 1 lần
  chatDelay: 1500000,    // 25 phút chat 1 lần
  reconnectDelay: 5000,  // 5 giây thử kết nối lại khi bị ngắt
  chatMessages: [
    'dái bé',
    'botdz',
    'saygex69'
  ],
  randomOrder: false
}
// =================================

function log(tag, msg) {
  const time = new Date().toLocaleTimeString('vi-VN', { hour12: false })
  console.log(`[${time}] [${tag}] ${msg}`)
}

let jumpInterval = null
let chatInterval = null

function createBot() {
  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  // ===== SỰ KIỆN KHI BOT SPAWN VÀO GAME =====
  bot.on('spawn', () => {
    log('SYSTEM', 'Bot đã vào server!')

    // Xóa bộ đếm cũ nếu có
    if (jumpInterval) clearInterval(jumpInterval)
    if (chatInterval) clearInterval(chatInterval)

    // Tự động nhảy
    jumpInterval = setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 200)
    }, config.jumpDelay)

    // Tự động chat
    let i = 0
    chatInterval = setInterval(() => {
      if (config.chatMessages.length === 0) return

      const msg = config.randomOrder
        ? config.chatMessages[Math.floor(Math.random() * config.chatMessages.length)]
        : config.chatMessages[i]

      bot.chat(msg)
      log('BOT', msg)

      if (!config.randomOrder) {
        i = (i + 1) % config.chatMessages.length
      }
    }, config.chatDelay)
  })

  // ===== SỰ KIỆN XỬ LÝ CHAT & MESSAGES =====
  // Đặt bên ngoài 'spawn' để không bị rò rỉ bộ nhớ (memory leak) khi bot reconnect
  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    log('CHAT', `${username}: ${message}`)

    if (message.toLowerCase() === 'hi') {
      bot.chat(`Chào ${username}!`)
      log('BOT', `Chào ${username}!`)
    }
  })

  bot.on('message', (jsonMsg) => {
    const text = jsonMsg.toString().trim()
    // Bỏ qua tin nhắn trống hoặc tin nhắn dạng chat chơi (<player> msg)
    if (!text || (text.includes('<') && text.includes('>'))) return
    log('SERVER', text)
  })

  bot.on('playerJoined', (player) => log('JOIN', player.username))
  bot.on('playerLeft', (player) => log('LEFT', player.username))

  // ===== SỰ KIỆN HỆ THỐNG & KẾT NỐI =====
  bot.on('death', () => log('BOT', 'Bot đã chết!'))
  bot.on('error', (err) => log('ERROR', err.message))

  bot.on('end', () => {
    log('SYSTEM', `Ngắt kết nối. Thử lại sau ${config.reconnectDelay / 1000}s...`)
    
    // Dọn dẹp interval khi ngắt kết nối
    if (jumpInterval) clearInterval(jumpInterval)
    if (chatInterval) clearInterval(chatInterval)
    
    // Tự động kết nối lại
    setTimeout(createBot, config.reconnectDelay)
  })
}

// Khởi chạy bot
createBot()
