function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
module.exports = {
  serverQ: "server_queue",
  clientQ: "task_queue",
  rabbitServer: "amqp://localhost",
  generateUuid,
  randomIntFromInterval
};
