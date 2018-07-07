const handler = require('./index').handler

handler(null, null, (error, result) => {
  if (error != null) {
    console.error(error)
  } else {
    console.info('Done')
  }
})