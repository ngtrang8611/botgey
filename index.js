const express = require('express');
const app = express();
const mineflayer = require('mineflayer');

// Khởi tạo route cơ bản để Render kiểm tra health-check thành công
app.get('/', (req, res) => {
  res.send('Bot Mineflayer is active!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server HTTP đang chạy trên cổng ${PORT}`);
});

function createMyBot() {
  const bot = mineflayer.createBot({
    host: 'vhoanghehe.aternos.me',
    port: 22693,
    username: 'hehechilabotthui',
    version: '1.20.1'
  });

  // Khi bot vào game thành công
  bot.on('spawn', () => {
    console.log('=> Bot [hehechilabotthui] đã vào game thành công!');
  });

  // Bắt lỗi hệ thống để tránh crash bot
  bot.on('error', (err) => {
    console.log('=> Lỗi Bot gặp phải:', err.message);
  });

  // Thông báo khi bot bị kick hoặc ngắt kết nối
  bot.on('kicked', (reason) => {
    console.log('=> Bot bị ngắt kết nối/kick với lý do:', reason);
  });

  // Tự động kết nối lại sau 10 giây nếu bị ngắt kết nối
  bot.on('end', () => {
    console.log('=> Bot đã ngắt kết nối khỏi server. Đang thử kết nối lại sau 10 giây...');
    setTimeout(createMyBot, 10000);
  });
}

// Khởi chạy bot
createMyBot();const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server HTTP dang chay tren cong ${PORT}`);
});
const mineflayer = require('mineflayer')

function createMyBot() {
  const bot = mineflayer.createBot({
    host: 'vhoanghehe.aternos.me',         // TODO: Thay bằng IP Server của bạn (ví dụ: '127.0.0.1' hoặc 'sv.domain.com')
    port: 22693,               // TODO: Thay bằng Port Server của bạn (mặc định là 25565)
    username: 'hehechilabotthui',
    
    // ĐIỀN CHÍNH XÁC PHIÊN BẢN SERVER ĐANG CHẠY ĐỂ TRÁNH LỖI VĂNG PACKET SYSTEM_CHAT
    // Ví dụ: '1.20.1', '1.19.4', '1.18.2', '1.12.2', ...
    version: '1.20.1'          
  })

  // Khi bot vào game thành công
  bot.on('spawn', () => {
    console.log('=> Bot [hehechilabotthui] đã vào game thành công!')
  })

  // Bắt lỗi hệ thống để tránh crash bot
  bot.on('error', (err) => {
    console.log('=> Lỗi Bot gặp phải:', err.message)
  })

  // Thông báo khi bot bị kick hoặc ngắt kết nối
  bot.on('kicked', (reason) => {
    console.log('=> Bot bị ngắt kết nối/kick với lý do:', reason)
  })

  // Tự động kết nối lại sau 10 giây nếu bị ngắt kết nối
  bot.on('end', () => {
    console.log('=> Bot đã ngắt kết nối khỏi server. Đang thử kết nối lại sau 10 giây...')
    setTimeout(createMyBot, 10000)
  })
}

// Khởi chạy bot
createMyBot()
