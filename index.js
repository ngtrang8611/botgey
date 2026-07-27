const express = require('express');
const app = express();
const mineflayer = require('mineflayer');

app.get('/', (req, res) => {
  res.send('Bot Mineflayer is active!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server HTTP dang chay tren cong ${PORT}`);
});

function createMyBot() {
  const bot = mineflayer.createBot({
    host: 'vhoanghehe.aternos.me',
    port: 22693,
    username: 'hehechilabotthui',
    version: '1.20.1'
  });

  let jumpInterval = null;

  bot.on('spawn', () => {
    console.log('=> Bot [hehechilabotthui] đã vào game thành công!');

    // Nhảy mỗi 3 giây (3000 ms)
    jumpInterval = setInterval(() => {
      bot.setControlState('jump', true);
      // Tắt phím nhảy sau 100 miligiây để bot đáp đất tự nhiên
      setTimeout(() => {
        bot.setControlState('jump', false);
      }, 100);
    }, 3000); 
  });

  bot.on('error', (err) => {
    console.log('=> Lỗi Bot gặp phải:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('=> Bot bị ngắt kết nối/kick với lý do:', reason);
  });

  bot.on('end', () => {
    // Dọn dẹp bộ đếm giờ khi bot ngắt kết nối để tránh trùng lặp loop
    if (jumpInterval) clearInterval(jumpInterval);

    console.log('=> Bot đã ngắt kết nối khỏi server. Đang thử kết nối lại sau 10 giây...');
    setTimeout(createMyBot, 10000);
  });
}

createMyBot();
