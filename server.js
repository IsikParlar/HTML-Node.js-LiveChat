var server = require('http').createServer();
var io = require('socket.io')(server);
var kisiler = {};

function kisi(id) {
  this.id = id;
  this.ad = "Misafir";
  this.tx = null;
}

var data;

io.sockets.on('connection', function (socket) {
  console.log("Yeni birisi bağlandı");

  socket.on('baslat', function (data, yanit) {
    var id = socket.id;
    kisiler[id] = new kisi(id);
    yanit(id);

    console.log(kisiler);
  });

  socket.on('mesaj', function (data) {
    if (!kisiler[data.id]) return;
    console.log("Mesaj: " + data.id + " / " + data.ad + " / " + data.tx);
    socket.emit('sohbet', data);
    socket.broadcast.emit('sohbet', data);
  });

  socket.on('disconnect', function () {
    if (!kisiler[socket.id]) return;
    delete kisiler[socket.id];
    socket.broadcast.emit('killPlayer', socket.id);
  });
});

console.log("Canlı sohbet başladı");
server.listen(3000);