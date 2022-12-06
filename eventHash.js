const crypto = require('crypto')

const NULL_KEY = '0'
const MAX_KEY_LENGTH = 256

exports.deterministicPartitionKey = (event) => {
  if (!event) return NULL_KEY

  const candidate = readEventKey(event)
  const normalizedKey = normalizeKeyType(candidate)
  return hashLongKey(normalizedKey)
}

// Extract the partitionKey field, otherwise hash the object
const readEventKey = (event) =>
  event['partitionKey'] ? event.partitionKey : getHash(JSON.stringify(event))

// Stringify a key if it is not already a string
const normalizeKeyType = (key) =>
  typeof key !== 'string' ? JSON.stringify(key) : key

// Hash a key if is it too long of a string
const hashLongKey = (key) => (key.length > MAX_KEY_LENGTH ? getHash(key) : key)

const getHash = (key) => crypto.createHash('sha3-512').update(key).digest('hex')
