var
    test = require('ava'),
    ProtoMessages = require('connect-protobuf-messages'),
    EncodeDecode = require('connect-js-encode-decode'),
    AdapterTLS = require('connect-js-adapter-tls'),
    protocol = new ProtoMessages([
        {
            file: 'node_modules/connect-protobuf-messages/src/main/protobuf/CommonMessages.proto',
            protoPayloadType: 'ProtoPayloadType'
        }
    ]),
    adapter = new AdapterTLS({
        host: 'sandbox-tradeapi.spotware.com',
        port: 5032
    }),
    encodeDecode = new EncodeDecode(),
    createCodec = require('./index').codec,
    codec = createCodec(encodeDecode, protocol);

test.cb('encode and send ping message then recive and decode respond', t => {
    const
        payloadType = 52,
        payload = {timestamp: Date.now()},
        clientMsgId = 'uuid';

    protocol.load();
    protocol.build();

    adapter.onOpen(function () {
        adapter.send(
            codec.encode(payloadType, payload, clientMsgId)
        );
    });
    adapter.onData(function (data) {
        codec.decode(data);
    });
    codec.subscribe(function (payloadType, respond, id) {
        t.is(53, payloadType);
        t.not(respond.timestamp, undefined);
        t.is(clientMsgId, id);
        t.end();
    });
    adapter.connect();
});
