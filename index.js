"use strict";
exports.__esModule = true;
function codec(adapter, encoderDecoder, protocol) {
    return {
        encode: function (payloadType, payload, clientMsgId) {
            return encoderDecoder.encode(protocol.encode(payloadType, payload, clientMsgId));
        },
        decode: function (callback) {
            encoderDecoder.registerDecodeHandler(function (data) {
                var message = protocol.decode(data);
                callback(message.payloadType, message.payload, message.clientMsgId);
            });
            adapter.onData(function (data) {
                encoderDecoder.decode(data);
            });
        }
    };
}
exports.codec = codec;
;
