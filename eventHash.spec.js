const crypto = require('crypto')

const eventHash = require('./eventHash')

// Test fixtures
const falseyInputs = [0, '', null, undefined, false]
const testKeyValue = 'testKey'
const defaultEvent = { partitionKey: testKeyValue }

describe('deterministicPartitionKey', () => {
  test('return the default partition key if the event is a falsey value', () => {
    falseyInputs.map((inp) => {
      console.log(inp, 'INP')
      expect(eventHash.deterministicPartitionKey(inp)).toEqual('0')
    })
  })

  test('return the `partitionKey` if found on the event as a string', () => {
    const candidate = eventHash.deterministicPartitionKey(defaultEvent)
    expect(candidate).toEqual(testKeyValue)
  })

  test('stringify and return the `partitionKey` if it is not a string', () => {
    const testKey = 12345
    const event = { partitionKey: testKey }

    const candidate = eventHash.deterministicPartitionKey(event)
    expect(candidate).toEqual(testKey.toString())
  })

  test('it should hash the event object as a key if no `partitionKey` is present', () => {
    const event = { someOtherField: testKeyValue }

    const data = JSON.stringify(event)

    const defaultHash = crypto.createHash('sha3-512').update(data).digest('hex')

    const candidate = eventHash.deterministicPartitionKey(event)
    expect(candidate).toEqual(defaultHash)
  })

  test('it should hash partition keys that are longer than the maximum', () => {
    const bigString = '#'.repeat(255)
    const biggerString = `${bigString}###`

    const bigStringCandidate = eventHash.deterministicPartitionKey({
      partitionKey: bigString,
    })

    const biggerStringCandidate = eventHash.deterministicPartitionKey({
      partitionKey: biggerString,
    })

    expect(bigStringCandidate).toEqual(bigString)
    // TODO: check not != biggerString instead
    // TODO: check valid sha3-512
    expect(biggerStringCandidate).toEqual(
      '73063b360b3a5e5e4176f01022864951290d486b5a15712945a3e45d9fda17d5c775d998ed8e8fd492ba25324e7037c22a8e200e5c31ed3ab1205614464855f7'
    )
  })
})
