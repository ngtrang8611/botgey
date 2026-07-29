const mineflayer = require('mineflayer')

// ====== CẤU HÌNH TÙY CHỈNH ======
const config = {
  host: 'vhoanghehe.aternos.me',
  port: 22693,
  username: 'BotCuaToi',
  version: '1.20.1',

  jumpDelay: 3000,
  chatDelay: 1500000,
  reconnectDelay: 5000,
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

  bot.on('spawn', () => {
    log('SYSTEM', 'Bot đã vào server!')

    // Dọn dẹp interval cũ (nếu có)
    if (jumpInterval) clearInterval(jumpInterval)
    if (chatInterval) clearInterval(chatInterval)

    // ===== TỰ ĐỘNG NHẢY =====
    jumpInterval = setInterval(() => {
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 200)
    }, config.jumpDelay)

    // ===== TỰ ĐỘNG CHAT =====
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

    // ===== ĐĂNG KÝ EVENT CHAT/MESSAGE CHỈ SAU KHIN BOT VÀO SERVER =====
    bot.on('chat', (username, message) => {
      if (username === bot.username) return
      log('CHAT', `${username}: ${message}`)

      if (message === 'hi') {
        bot.chat(`Chào ${username}!`)
        log('BOT', `Chào ${username}!`)
      }
    })

    bot.on('message', (jsonMsg) => {
      const text = jsonMsg.toString().trim()
      // Bỏ qua tin nhắn trống hoặc tin nhắn chat thông thường (vì đã log ở event 'chat')
      if (!text || text.includes('<') && text.includes('>')) return
      log('SERVER', text)
    })

    bot.on('playerJoined', (player) => log('JOIN', player.username))
    bot.on('playerLeft', (player) => log('LEFT', player.username))
  })

  // ===== SỰ KIỆN HỆ THỐNG =====
  bot.on('death', () => log('BOT', 'Bot đã chết!'))
  bot.on('error', (err) => log('ERROR', err.message))

  bot.on('end', () => {
    log('SYSTEM', `Ngắt kết nối. Thử lại sau ${config.reconnectDelay / 1000}s...`)
    if (jumpInterval) clearInterval(jumpInterval)
    if (chatInterval) clearInterval(chatInterval)
    setTimeout(createBot, config.reconnectDelay)
  })
}

// Khởi chạy bot
createBot()
