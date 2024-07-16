var amqp = require('amqplib/callback_api');
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  pool: true,

  disableFileAccess: true,
  disableUrlAccess: true,

  auth: {
    user: process.env.MAIL,
    pass: process.env.MAILPASS
  }
}, {
  from: process.env.MAIL
})

amqp.connect(`amqp://${process.env.MQ}`, function(error0, connection) {
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
        durable : true
      });

      channel.assertQueue(queue, {
        exclusive: false
      }, function(error2, q){
        if (error2){
          throw error2;
        }

        channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.bindQueue(q.queue, exchange, event)

        channel.consume(q.queue, data => {
          let message = data.content.toString();
          let mailOptions = {
            to: process.env.RECIEVER,
            text: message,
            subject: "Message from nodemailer"
          }

          console.log(message);

          transporter.sendMail(mailOptions, (error, info) => {
            if (error){
              console.log(error.stack)
              return channel.nack(data);
            }
      
            console.log("Delivered message", info.messageId);
            channel.ack(data);
          });
        });
      });
    });
  });

  function handleHelloQueue(message){
    console.log(` [x] Received a message: ${message.content.toString()}, reading env email ${process.env.MAIL}`);
  }