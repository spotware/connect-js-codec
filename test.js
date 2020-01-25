const test = require('ava')
const OpenApiProtocol = require('open-api-protocol')
const EncodeDecode = require('connect-js-encode-decode')
const createAdapter = require('connect-js-adapter-tls')

const { Codec, codec: createCodec } = require('./index')

const connection_config = {
  host: 'sandbox-tradeapi.spotware.com',
  port: 5035,
}

test.cb('encode and send heartbeat message then receive and decode response', t => {  
  const protocol = new OpenApiProtocol()
  protocol.load()
  protocol.build()
  
  const encodeDecode = new EncodeDecode()
  
  const codec = new Codec(encodeDecode, protocol)

  const adapter = createAdapter(codec)
  
  const payloadType = protocol.getPayloadTypeByName('ProtoOAVersionReq')
  const payload = {}
  const clientMsgId = 'uuid'

  adapter.onOpen(function () {
    const message = { payloadType, payload, clientMsgId }
    adapter.send(message)
  })
  
  codec.subscribe(function (payloadType, response, id) {
    t.is(payloadType, 2105)
    t.is(response.version, '60')
    t.is(id, clientMsgId)
    t.end()
  })

  adapter.connect(connection_config)
})

test.cb('w/ factory function, encode and send heartbeat message then receive and decode response', t => {
  const protocol = new OpenApiProtocol()
  protocol.load()
  protocol.build()
  
  const encodeDecode = new EncodeDecode()
  
  const codec = createCodec(encodeDecode, protocol)
  
  const adapter = createAdapter(codec)
  
  const payloadType = protocol.getPayloadTypeByName('ProtoOAVersionReq')
  const payload = {}
  const clientMsgId = 'uuid'

  adapter.onOpen(function () {
    const message = { payloadType, payload, clientMsgId }
    adapter.send(message)
  })

  codec.subscribe(function (payloadType, response, id) {
    t.is(payloadType, 2105)
    t.is(response.version, '60')
    t.is(id, clientMsgId)
    t.end()
  })

  adapter.connect(connection_config)
})
