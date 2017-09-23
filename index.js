'use strict';

const https = require('https');
const cheerio = require('cheerio');

exports.handler = (event, context, callback) => {

  const uri = 'https://de.dawanda.com/user/ruppertdesign';

  https.get(uri, response => {
    const { statusCode } = response;
    console.info(statusCode)
    if (statusCode !== 200) {
      callback(new Error(`Fetching ratings failed with status: ${statusCode}`));
    } else {
      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        const $ = cheerio.load(rawData);
        const rating = $('.rating .average').text();
        const votes = $('.votes').text();
        callback(null, {
          rating,
          votes,
        });
      });
    }
  });

};
