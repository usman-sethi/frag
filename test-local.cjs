const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(res.statusCode);
    if (data.includes('Vite')) console.log('Vite specific');
    else console.log(data); // print the whole thing
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
