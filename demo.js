import axios from 'axios'
import Promise from './src/index.js'

const p1 = new Promise((resolve, reject) => {
  reject('超时')
  axios.get('http://localhost:3000/1').then((value) => resolve(value.data))
})

const p2 = new Promise((resolve) => {
  axios.get('http://localhost:3000/2').then((value) => resolve(value.data))
})

const p3 = new Promise((resolve) => {
  axios.get('http://localhost:3000/3').then((value) => resolve(value.data))
})

Promise.all([p1, p2, p3]).then(
  (value) => {
    console.log(value)
  },
  (reason) => {
    console.log(reason)
  },
)
