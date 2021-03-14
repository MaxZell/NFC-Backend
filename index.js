const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

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
    /*
        run from root
        fetch("http://localhost:5000/ajax/save-data", {"method": "POST", "body": {"uid":"test"}}).then(r => console.log(r))
    */
    let hash = req.body.uid;
    const pw = process.env.Mongo_m242;
    const uri = `mongodb+srv://m242:${pw}@cluster0.9rupy.mongodb.net/m242?retryWrites=true&w=majority`;
    const client = new MongoClient(encodeURI(uri), { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        console.log('-------', err)
        
        console.log("myhash: " + hash)
        var myobj = { uid: hash};
        client.db("m242").collection("cards").insertOne(myobj, function(err, res) {
            if (err) throw err;
                console.log("UID saved");  
        //   client.close();
        })
    res.send(`UID saved`);
    });
});

app.post('/ajax/login', function(req, res) {
    res.send(`data from server: ${req.body.uid}`);
});