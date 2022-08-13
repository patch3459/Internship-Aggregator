// fetch.js
const fetch = require('node-fetch')

module.exports = (url, args = {}) => {
  args.headers = args.headers || {}
  args.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0'
  return fetch(url, args)
}