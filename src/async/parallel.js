const { promisify } = require('util')

const parallel = async (args, callback, keys) => {
  const promises = args.map((arg) => promisify(arg)())
  let result
  try {
    result = await Promise.all(promises)
  } catch (error) {
    callback(error)
  }
  callback(null, result)

  if (keys) {
    const obj = {}
    keys.forEach((key, i) => (obj[key] = result[i]))
    return obj
  }
}

module.exports = parallel
