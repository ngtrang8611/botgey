const mineflayer = require('mineflayer')
const { broadcastLog, setupSocket } = require('./server')

// ====== CẤU HÌNH TÙY CHỈNH ======
const config = {
  host: 'vhoanghehe.aternos.me',
  port: 22693,
  username: 'BotCuaToi',
  version: '1.20.1',

  jumpDelay: 3000,       // thời gian giữa mỗi lần nhảy (ms)
  chatDelay: 15000,      // thời gian giữa mỗi tin nhắn (ms)
  chatMessages: [        // ← sửa nội dung chat tùy ý ở đây
    'Xin chào!',
    'Bot đang hoạt động',
    'Vui vẻ nhé'
  ],
  randomOrder: false     // true = chat ngẫu nhiên, false = chat lần lượt
}
// =================================

const bot = mineflayer.createBot({
  host: config.host,
  port: config.port,
  username: config.username,
  version: config.version
})

setupSocket(bot) // kết nối bot với web console

// Hàm log: vừa in ra CMD vừa gửi lên web console
function log(tag, msg) {
  const time = new Date().toLocaleTimeString()
  console.log(`[${time}] [${tag}] ${msg}`)
  broadcastLog(tag, msg)
}

bot.on('spawn', () => {
  log('SYSTEM', 'Bot đã vào server!')

  // ===== TỰ ĐỘNG NHẢY =====
  setInterval(() => {
    bot.setControlState('jump', true)
    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 200)
  }, config.jumpDelay)

  // ===== TỰ ĐỘNG CHAT =====
  let i = 0
  setInterval(() => {
    if (config.chatMessages.length === 0) return

    const msg = config.randomOrder
      ? config.chatMessages[Math.floor(Math.random() * config.chatMessages.length)]
      : config.chatMessages[i]

    bot.chat(msg)
    log('BOT_CHAT', msg)

    if (!config.randomOrder) {
      i = (i + 1) % config.chatMessages.length
    }
  }, config.chatDelay)
})

// ===== LOG CHAT CỦA NGƯỜI CHƠI TRONG GAME =====
bot.on('chat', (username, message) => {
  if (username === bot.username) return

  log('CHAT', `${username}: ${message}`)

  if (message === 'hi') {
    bot.chat(`Chào ${username}!`)
    log('BOT_CHAT', `Chào ${username}!`)
  }
})

// ===== LOG SỰ KIỆN KHÁC =====
bot.on('playerJoined', (player) => {
  log('PLAYER', `${player.username} đã vào server`)
})

bot.on('playerLeft', (player) => {
  log('PLAYER', `${player.username} đã rời server`)
})

bot.on('death', () => {
  log('BOT', 'Bot đã chết, đang hồi sinh...')
})

bot.on('error', (err) => log('ERROR', err.message))
bot.on('end', () => log('SYSTEM', 'Bot đã ngắt kết nối'))
