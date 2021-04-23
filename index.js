const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const mqtt = require('mqtt')
const MqttClient  = mqtt.connect('mqtt://cloud.tbz.ch')

const app = express();
const port = process.env.PORT || 5000;

// const pw = process.env.Mongo_m242;
const pw = "mypass";
const uri = `mongodb+srv://m242:${pw}@cluster0.9rupy.mongodb.net/m242?retryWrites=true&w=majority`;
const client = new MongoClient(encodeURI(uri), { useNewUrlParser: true, useUnifiedTopology: true });


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

const topic_id = "8x3ebv3f4w3EUchR";

app.post('/ajax/login', function(req, res) {
    client.connect(err => {
        console.log('-------', err)
        let inpt = req.body.uid;
        let query = { "uid" : inpt}
        client.db("m242").collection("cards").findOne(query, function(err, result) {
            // if (err) throw err;
            if(result){
                MqttClient.publish(`${topic_id}/answer`, `exist`)
                res.send(`data from server: ${result.uid}`);
            }else if(result == null){
                MqttClient.publish(`${topic_id}/answer`, `notexist`)
            }
            console.log(result);
        });
    });
    
    // const salt = bcrypt.genSaltSync(10);
    // let hash = bcrypt.hashSync("Hello", 10);
    // bcrypt.compareSync("Hello", hash);
    // console.log(hash);
    // res.send(`data from server: ${hash}`);
});

app.post('/ajax/register', function(req, res) {
    let inpt = req.body.uid;
    let hash = bcrypt.hashSync(inpt, 10);
    client.connect(err => {
        console.log('-------', err)
        client.connect(err => {
            console.log('-------', err)
            var myobj = {"uid": inpt, "hash": hash};
            client.db("m242").collection("cards").insertOne(myobj, function(err, res) {
                if (err) throw err;
                    MqttClient.publish(`${topic_id}/answer`, `UID saved`)
            })
        });
    });
});