const express = require('express')
const mongoose = require('mongoose')
const Messages = require('./dbMessageSchema')
var Pusher = require('pusher');
var cors  = require('cors');
const { timeStamp } = require('console');


const PORT = process.env.PORT || 5000;
var pusher = new Pusher({
    appId: '1096374',
    key: 'ba148a15e0bc64dd89bd',
    secret: '757d979cee6d24f36c60',
    cluster: 'ap2',
    encrypted: true
  });

const app = express()
const connection_url ='mongodb+srv://Admin:yaKDO02hmRu4ufa1@cluster0.cjttr.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const db = mongoose.connection

db.once("open",()=>{
    console.log("Db connected")

    const msgCollection= db.collection('messagedetails');
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log("change",change )

        if(change.operationType === 'insert'){
            const messageContent = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name : messageContent.name,
                message : messageContent.message,
                timestamp:messageContent.timestamp,
                received:messageContent.recived,
            });
        }else{
            console.log("pusher error")
        }
    })
})

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.status(200).send("Hello World")
})

app.post('/messages/new',async (req,res)=>{
    const dbMessage = req.body;

    await Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.send("error").status(500)
        }else{
            res.send(`new message created : \n ${data}`).status(201)
        }
    })
})

app.get('/messages/sync',async (req,res)=>{
    await Messages.find((err,data)=>{
        if(err){
            res.send(err).status(500)
        }
        else{
            res.send(data).status(200)
        }
    })
})

app.listen(PORT ,()=>console.log("Server started on "+PORT))


// yaKDO02hmRu4ufa1

//mongodb+srv://Admin:yaKDO02hmRu4ufa1@cluster0.cjttr.mongodb.net/<dbname>?retryWrites=true&w=majority