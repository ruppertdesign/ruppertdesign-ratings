const https = require('https')
const cheerio = require('cheerio')

exports.handler = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      protocol: 'https:',
      hostname: 'www.etsy.com',
      path: '/de/shop/RUPPERTdesign',
      headers: {
        'Authority': 'www.etsy.com',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,image/webp,image/apng,*/*q=0.8',
        'Accept-Language': 'de-DE,deq=0.9,en-USq=0.8,enq=0.7',
      }
    }
    https.get(options, response => {
      const { statusCode } = response
      console.info(`[${statusCode}] ${options.path}`)
      if (statusCode !== 200) {
        reject(new Error(`Fetching ratings failed with status: ${statusCode}`))
      } else {
        response.setEncoding('utf8')
        let rawData = ''
        response.on('data', (chunk) => { rawData += chunk })
        response.on('end', () => {
          const $ = cheerio.load(rawData)
          const reviewsSection = $('.reviews-section .reviews-total')
          const rating = Math.round($('input[name=rating]', reviewsSection).val())
          const text = reviewsSection.text()
          const votes = /\(([0-9]+?)\)/.exec(text)[1]
          const result = {
            rating,
            votes,
          }
          console.info(result)
          resolve(result)
        })
      }
    })
  })
}
