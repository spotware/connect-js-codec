interface EncoderDecoder {
  encode: (data: ArrayBuffer | Buffer) => ArrayBuffer | Buffer
  decode: (data: ArrayBuffer | Buffer) => void
  registerDecodeHandler: (callback: (data: ArrayBuffer | Buffer) => void) => void
}

interface Protocol {
  encode: (payloadType: number, payload: Object, clienMsgId: string) => ArrayBuffer | Buffer
  decode: (data: ArrayBuffer | Buffer) => Message
}

interface Message {
  payloadType: number
  payload: Object
  clientMsgId: string
}

interface CodecInterface {
  encode: (payloadType: number, payload: Object, clientMsgId: string) => ArrayBuffer | Buffer
  decode: (data: ArrayBuffer | Buffer) => void
  subscribe: (callback: (payloadType: number, payload: Object, clienMsgId: string) => void) => void
}

export class Codec {
  encoderDecoder: EncoderDecoder
  protocol: Protocol
  
  constructor (encoderDecoder: EncoderDecoder, protocol: Protocol) {
    this.encoderDecoder = encoderDecoder
    this.protocol = protocol
  }

  public encode (payloadType, payload, clientMsgId) {
    return this.encoderDecoder.encode(
      this.protocol.encode(payloadType, payload, clientMsgId)
    )
  }
  
  public decode (data) {
    this.encoderDecoder.decode(data)
  }
  
  public subscribe (callback) {
    this.encoderDecoder.registerDecodeHandler((data) => {
      const message = this.protocol.decode(data)
      callback(message.payloadType, message.payload, message.clientMsgId)
    })
  }
}

export const codec = (encoderDecoder: EncoderDecoder, protocol: Protocol): Codec => (
  new Codec(encoderDecoder, protocol)
)
