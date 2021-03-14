const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('server running on port: ' + port);
})

app.use(express.static(path.join(__dirname, 'interface/')));
app.get('/', function(res) {
    res.sendFile(path.join(__dirname, 'interface/', 'index.html'));
});

app.get('/ajax/get-data', function(req, res) {
    data = "some data";
    res.send(`data from server: ${data}`);
    console.log("get-data");
});

app.post('/ajax/save-data', function(req, res) {
    // res.send(`start`);
    const pw = process.env.Mongo_m242;
    const uri = `mongodb+srv://m242:${pw}@cluster0.9rupy.mongodb.net/m242?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        // res.send(`connection`);
    //   const collection = client.db("m242").collection("cards");
        let hash = req.body.uid;
        var myobj = { uid: hash};
        client.db("m242").collection("cards").insertOne(myobj, function(err, res) {
            if (err) res.send(err);
                console.log("UID saved");
      client.close();
      res.send(`connection2`);
    });
    res.send(`UID saved`);

    // const pw = process.env.MONGODB_URI;
    // const url = `mongodb+srv://m242:${pw}@cluster0.9rupy.mongodb.net/m242?retryWrites=true&w=majority`;
    // // const url = `mongodb+srv://m242:${pw}@cluster0-shard-00-00.9rupy.mongodb.net:27017,cluster0-shard-00-01.9rupy.mongodb.net:27017,cluster0-shard-00-02.9rupy.mongodb.net:27017/myFirstDatabase?authSource=admin&replicaSet=atlas-5iir9n-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;
    // MongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("m242");
    //     let hash = req.body.uid;
    //     var myobj = { UID: hash};
    //     dbo.collection("cards").insertOne(myobj, function(err, res) {
    //         if (err) throw err;
    //             console.log("UID saved");
    //       db.close();
    //     });
    //     res.send(`UID saved`);
    });
});

app.post('/ajax/login', function(req, res) {
    res.send(`data from server: ${req.body.uid}`);
});

// app.get('/coronaApi', function(req, res) {
//     //get all corona api json
//     fetch("https://covid-19-data.p.rapidapi.com/country?name=switzerland", {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-key": "",
//             "x-rapidapi-host": ""
//         }
//     })
//     .then(response => {
//         return response.json();
//     })
//     .then((data) => {
//         let result = data[0].deaths;
//         res.send(`CH Covid-19 deaths: ${result}`);
//     })
//     .catch(err => {
//         console.error(err);
//     });
// });

//connect to mongodb
// const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
// // Create a new MongoClient
// const client = new MongoClient(uri);
// async function saveToMDB() {
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
//   finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run();
// // run().catch(console.dir);