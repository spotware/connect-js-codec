module.exports = function (adapter, encoderDecoder, protocol) {
    return {
        encode: function (payloadType, payload, clientMsgId) {
            return encoderDecoder.encode(
                protocol.encode(payloadType, payload, clientMsgId)
            );
        },
        decode: function (callback) {
          console.log(333)
            encoderDecoder.registerDecodeHandler(function (message) {
                var
                    payloadType,
                    payload,
                    clientMsgId;

                message = protocol.decode(message);

                payloadType = message.payloadType;
                payload = message.payload;
                clientMsgId = message.clientMsgId;

                callback(payloadType, payload, clientMsgId);
            });
            adapter.onData(function (data) {
                encoderDecoder.decode(data);
            });
        }
    };
};
