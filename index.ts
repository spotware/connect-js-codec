interface Adapter {
    onData: (callback: (data: ArrayBuffer) => void) => void;
}

interface EncoderDecoder {
    encode: (data: ArrayBuffer) => ArrayBuffer;
    decode: (data: ArrayBuffer) => void;
    registerDecodeHandler: (callback: (data: ArrayBuffer) => void) => void;
}

interface Protocol {
    encode: (payloadType: number, payload: Object, clienMsgId: string) => ArrayBuffer;
    decode: (data: ArrayBuffer) => Message;
}

interface Message {
    payloadType: number;
    payload: Object;
    clientMsgId: string;
}

interface Codec {
    encode: (payloadType: number, payload: Object, clientMsgId: string) => ArrayBuffer;
    decode: (callback: (payloadType: number, payload: Object, clientMsgId: string) => void) => void;
}

export function codec (adapter: Adapter, encoderDecoder: EncoderDecoder, protocol: Protocol): Codec {
    return {
        encode: (payloadType, payload, clientMsgId) => {
            return encoderDecoder.encode(
                protocol.encode(payloadType, payload, clientMsgId)
            );
        },
        decode: (callback) => {
            encoderDecoder.registerDecodeHandler((data) => {
                const
                    message = protocol.decode(data);

                callback(message.payloadType, message.payload, message.clientMsgId);
            });
            adapter.onData((data) => {
                encoderDecoder.decode(data);
            });
        }
    };
};
