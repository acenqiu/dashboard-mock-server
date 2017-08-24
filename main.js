const fs = require('fs')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const serveStatic = require('serve-static')
const jsonData = JSON.parse(fs.readFileSync(__dirname + '/Ets2TestTelemetry.json', {'encoding': 'utf8'}))

app.use(serveStatic('Html', {'index': false}))

app.get('/api/ets2/telemetry', (req, res) => {
  res.send(JSON.stringify(jsonData))
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.on('requestData', () => {
    io.emit('updateData', JSON.stringify(randomData()))
  })
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
})

// setInterval(function() {
//   io.emit('updateData', JSON.stringify(randomData()))
// }, 500)

let frame = 0

function randomData() {
  frame++
  jsonData.truck.speed = 78 + 5 * Math.sin(frame * 0.1)
  jsonData.truck.odometer = 105830 + frame * 0.01
  jsonData.truck.engineRpm = 1337 + 1 * Math.sin(frame)

  return jsonData
}

server.listen(25555, () => {
  console.log('Running on 25555 (＾－＾)V')
})
