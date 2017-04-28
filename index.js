"use strict";
exports.__esModule = true;
function codec(encoderDecoder, protocol) {
    return {
        encode: function (payloadType, payload, clientMsgId) {
            return encoderDecoder.encode(protocol.encode(payloadType, payload, clientMsgId));
        },
        decode: function (data) {
            encoderDecoder.decode(data);
        },
        subscribe: function (callback) {
            encoderDecoder.registerDecodeHandler(function (data) {
                var message = protocol.decode(data);
                callback(message.payloadType, message.payload, message.clientMsgId);
            });
        }
    };
}
exports.codec = codec;
;
