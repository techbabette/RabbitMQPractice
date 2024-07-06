<?php
require_once '../vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$connection = new AMQPStreamConnection('rabbitmq', 5672, 'guest', 'guest');
$channel = $connection->channel();


$event = "mail_token";

$token = "123";
$data = ["email" => "placeholder@mail.com", "token" => $token];
$data = implode(" ", $data);

$channel->exchange_declare("main_exchange", "direct", false, false, false);


//$channel->queue_declare('hello', false, false, false, false);

$msg = new AMQPMessage($data);
$channel->basic_publish($msg, 'main_exchange', $event);

echo " [x] Sent $event, $data\n";

$channel->close();
$connection->close();
?>