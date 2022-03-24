const parallelRunner = require('./parallel')
const { promisify } = require('util')

let completed = []

const isFunction = (arg) => {
  return typeof arg === 'function'
}

const wasExecuted = (key) => completed.includes(key)

const isSatisfied = (conditions) => {
  return conditions.every((condition) => completed.includes(condition))
}

const group = (args) => {
  const entries = Object.entries(args)
  const parallels = entries.filter(([key, value]) => isFunction(value))
  const series = entries.filter(([key, value]) => !isFunction(value))
  return { parallels, series }
}

const executeParallels = async ({ parallels }) => {
  const promises = parallels.map(([_, value]) => value)
  const keys = parallels.map(([key]) => key)
  const results = await parallelRunner(promises, () => null, keys)
  completed.push(...keys)
  return results
}

const executeConditional = async ({ series }, results) => {
  const promises = series.map(([_, value]) => promisify(value.pop()))
  const conditions = series.map(([_, value]) => value)
  const keys = series.map(([key]) => key)

  while (!keys.every((key) => completed.includes(key))) {
    for (const [i, promise] of promises.entries()) {
      if (isSatisfied(conditions[i]) && !wasExecuted(keys[i])) {
        try {
          result = await promise(results)
          results[keys[i]] = result
          completed.push(keys[i])
        } catch (error) {
          throw new Error(error)
        }
      }
    }
  }
}

const auto = async (args, callback) => {
  let results
  completed = []

  try {
    results = await executeParallels(group(args))
    await executeConditional(group(args), results)
    callback(null, results)
  } catch (error) {
    callback(error)
  }
}

module.exports = auto
