const { promisify } = require('util')

const series = async (args, callback) => {
  const promises = args.map((arg) => promisify(arg))
  let result

  try {
    for (const promise of promises) {
      result = await promise()
    }
  } catch (error) {
    callback(error)
  }
  callback(null, result)
}

module.exports = series
