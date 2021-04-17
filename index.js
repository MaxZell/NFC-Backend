const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');

const mqtt = require('mqtt')
const MqttClient  = mqtt.connect('mqtt://cloud.tbz.ch')

const app = express();
const port = process.env.PORT || 5000;

const pw = process.env.Mongo_m242;
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

/**
 * HTTP
*/
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

app.post('/ajax/login', function(req, res) {
    res.send(`data from server: ${req.body.uid}`);
});

/**
 *  @todo: create http get for node-red
 * + parse function
*/

/**
 * MQTT
*/
const topic_id = "8x3ebv3f4w3EUchR";

MqttClient.on('connect', () => {
    MqttClient.subscribe(`${topic_id}/sensor`)
    MqttClient.subscribe(`${topic_id}/temperature`)
    MqttClient.subscribe(`${topic_id}/login`)
    MqttClient.subscribe(`${topic_id}/sensor`, function (err) {
      if (!err) {
          console.log("answer sended");
          MqttClient.publish(`${topic_id}/answer`, 'hi from Max =>connected')
      }
    })
})

MqttClient.on('message', function (topic, message) {
    if(topic === `${topic_id}/sensor`) {
        // console.log(message.toString())
        try {
            let preparedString = message.toString().replace(/'/gi, '"')
            // console.log(preparedString)
            let mqttJson = JSON.parse(JSON.parse(JSON.stringify(preparedString.toString())))
            console.log(`uid: ${mqttJson.uid}\ntime: ${mqttJson.time}\ntemperature: ${mqttJson.temperature}`)
            // MqttClient.publish(`${topic_id}/answer`, `uid: ${mqttJson.uid}\ntime: ${mqttJson.time}\ntemperature: ${mqttJson.temperature}`)
            MqttClient.publish(`${topic_id}/answer`, `temp: ${message.toString()}`)
          } catch(err) {
            console.error(err)
        }
    }else if(topic === `${topic_id}/temperature`){
        client.connect(err => {
            console.log('-------', err)
            client.connect(err => {
                console.log('-------', err)
                var myobj = {"uid": "some temperature placeholder"};
                client.db("m242").collection("cards").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                        console.log("UID saved");
                        MqttClient.publish(`${topic_id}/answer`, `UID saved`)
                })
            });
        });
    }else if(topic === `${topic_id}/login`){
        console.log(message.toString())
        MqttClient.publish(`${topic_id}/answer`, 'test successful')
    }
    // MqttClient.end()
})