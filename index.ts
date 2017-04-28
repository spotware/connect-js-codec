interface EncoderDecoder {
    encode: (data: ArrayBuffer | Buffer) => ArrayBuffer | Buffer;
    decode: (data: ArrayBuffer | Buffer) => void;
    registerDecodeHandler: (callback: (data: ArrayBuffer | Buffer) => void) => void;
}

interface Protocol {
    encode: (payloadType: number, payload: Object, clienMsgId: string) => ArrayBuffer | Buffer;
    decode: (data: ArrayBuffer | Buffer) => Message;
}

interface Message {
    payloadType: number;
    payload: Object;
    clientMsgId: string;
}

interface Codec {
    encode: (payloadType: number, payload: Object, clientMsgId: string) => ArrayBuffer | Buffer;
    decode: (data: ArrayBuffer | Buffer) => void;
    subscribe: (callback: (payloadType: number, payload: Object, clienMsgId: string) => void) => void;
}

export function codec (encoderDecoder: EncoderDecoder, protocol: Protocol): Codec {
    return {
        encode: (payloadType, payload, clientMsgId) => {
            return encoderDecoder.encode(
                protocol.encode(payloadType, payload, clientMsgId)
            );
        },
        decode: (data) => {
            encoderDecoder.decode(data);
        },
        subscribe: (callback) => {
            encoderDecoder.registerDecodeHandler((data) => {
                const
                    message = protocol.decode(data);

                callback(message.payloadType, message.payload, message.clientMsgId);
            });
        }
    };
};
