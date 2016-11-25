

const net = require('net');
const client = net.connect({host: '10.1.68.110', port: 23}, () => {
    // 'connect' listener
    console.log('Connected to Lutron!');
    setTimeout(() => {client.write('lutron\r\n');},1000);
    setTimeout(() => {client.write('lutron\r\n');},2000);
    setTimeout(() => {client.write('#MONITORING,3,1\r\n');},3000);

});
client.on('data', (data) => {
  console.log('RECEIVING TCP RESPONSE -- ')
  console.log(data.toString('ascii'));
});
client.on('end', () => {
  console.log('Disconnected from server!');
});