import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/1', (req, res) => {
  setTimeout(function () {
    res.send('数据1')
  }, 1000)
})

app.get('/2', (req, res) => {
  res.send('数据2')
})

app.get('/3', (req, res) => {
  setTimeout(function () {
    res.send('数据3')
  }, 2000)
})

app.listen(3000, () => {
  console.log('开启服务')
})
