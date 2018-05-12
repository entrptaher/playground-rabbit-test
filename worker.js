var amqp = require("amqplib/callback_api");
const config = require("./config");

amqp.connect(config.rabbitServer, function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.prefetch(1);
    ch.assertQueue(config.clientQ, { durable: true }, function(err, q) {
      var correlationId = config.generateUuid();
      console.log(`[*] Waiting for messages in ${q.queue} ${correlationId}`);

      ch.consume(
        q.queue,
        function(msg) {
          var secs = msg.content.toString().split(".").length - 1;
          console.log(
            `[x] Received: ${msg.content.toString()} from ${
              msg.properties.correlationId
            }`
          );

          setTimeout(()=>{
              const replyMsg = `Ping from worker-${process.env.pm_id}`;
              ch.sendToQueue(config.serverQ, new Buffer(replyMsg), {
                persistent: true,
                correlationId
              });
    
              console.log(`Sent: ${replyMsg}`)
              ch.ack(msg);
          }, config.randomIntFromInterval(1,3) * 1000)
        },
        { noAck: false }
      );
    });
  });
});
