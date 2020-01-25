"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Codec = /** @class */ (function () {
    function Codec(encoderDecoder, protocol) {
        this.encoderDecoder = encoderDecoder;
        this.protocol = protocol;
    }
    Codec.prototype.encode = function (payloadType, payload, clientMsgId) {
        return this.encoderDecoder.encode(this.protocol.encode(payloadType, payload, clientMsgId));
    };
    Codec.prototype.decode = function (data) {
        this.encoderDecoder.decode(data);
    };
    Codec.prototype.subscribe = function (callback) {
        var _this = this;
        this.encoderDecoder.registerDecodeHandler(function (data) {
            var message = _this.protocol.decode(data);
            callback(message.payloadType, message.payload, message.clientMsgId);
        });
    };
    return Codec;
}());
exports.Codec = Codec;
exports.codec = function (encoderDecoder, protocol) { return (new Codec(encoderDecoder, protocol)); };
