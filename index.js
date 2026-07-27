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

  bot.on('spawn', () => {
    console.log('=> Bot [hehechilabotthui] đã vào game thành công!');
  });

  bot.on('error', (err) => {
    console.log('=> Lỗi Bot gặp phải:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('=> Bot bị ngắt kết nối/kick với lý do:', reason);
  });

  bot.on('end', () => {
    console.log('=> Bot đã ngắt kết nối khỏi server. Đang thử kết nối lại sau 10 giây...');
    setTimeout(createMyBot, 10000);
  });
}

createMyBot();
