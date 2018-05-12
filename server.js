var amqp = require("amqplib/callback_api");
const config = require("./config");

amqp.connect(config.rabbitServer, function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.assertQueue(config.serverQ, { durable: true }, function(err, q) {
      var correlationId = config.generateUuid();

      ch.consume(
        config.serverQ,
        function(msg) {
          console.log(
            `[x] Received: ${msg.content.toString()} ${
              msg.properties.correlationId
            }`
          );
          ch.ack(msg);
        },
        { noAck: false }
      );

      var i = 0;
      setInterval(()=>{
          var msg = `Hello World! ${i}`;
          console.log(`[x] Sent: ${msg}`);
    
          ch.sendToQueue(config.clientQ, new Buffer(msg), {
            persistent: true,
            correlationId
          });
          i++;
      }, 10000)
    });
  });
});
