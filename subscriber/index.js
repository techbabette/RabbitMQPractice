var amqp = require('amqplib/callback_api');

amqp.connect('amqp://rabbitmq', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'main_exchange';
      var queue = "mail_queue"
      var event = "mail_token"


      channel.assertExchange(exchange, 'direct', {
        durable : false
      });

      channel.assertQueue(queue, {
        exclusive: true
      }, function(error2, q){
        if (error2){
          throw error2;
        }

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.bindQueue(q.queue, exchange, event)

        channel.consume(q.queue, handleHelloQueue, {
          noAck : true
        });
      });
    });
  });

  function handleHelloQueue(message){
    console.log(` [x] Received a message: ${message.content.toString()}, reading env email ${process.env.MAIL}`);
  }