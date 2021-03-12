const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
// const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 9500;;

app.listen(port, () => {
    console.log('server running on port: ' + port);
})

app.use(express.static(path.join(__dirname, 'interface/')));
app.get('/', function(res) {
    res.sendFile(path.join(__dirname, 'interface/', 'index.html'));
});

app.get('/ajax/get-data', function(req, res) {
    console.log("get-data");
});

//connect to mongodb
// const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
// // Create a new MongoClient
// const client = new MongoClient(uri);
// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     // Establish and verify connection
//     await client.db("m242").command({ ping: 1 });
//     console.log("Connected successfully to server");
//   }
//   catch{
//     console.dir
//   }
// //   finally {
// //     // Ensures that the client will close when you finish/error
// //     await client.close();
// //   }
// }
// run();
// // run().catch(console.dir);