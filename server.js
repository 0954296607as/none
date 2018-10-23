
const express = require('express');
const path=require ('path');
const socket=require('socket.io');

const fs=require('fs');
const sqlite=require('sqlite3');


const pathPublic=path.join(__dirname, '/public');
const app = express();
const port =process.env.PORT || 8080;
let list_of_users={};






app.use(express.static(pathPublic));

app.use(express.json());



let server= app.listen(port,'localhost',(err) => {
    if (err) {
        return console.log('something bad happened', err);
    };
    console.log(`server is listening on ${port}`);
});

let io=socket(server);

io.on('connection',function (client){   
//    console.log('client connected='+client.id);
    let id='U'+((client.id).substr(0,4)).toString();
    
    try{
        client.on('add users',(data)=>{


//         list_of_users[id]=data;
//           console.log(list_of_users);
//            console.log(io.engine.clientsCount);
            client.emit('add users',list_of_users);
            list_of_users[id]=data;
//            console.log(list_of_users);
            client.broadcast.emit('add users',{[id]: list_of_users[id]});


        });
        client.on('message', (data)=>{
            client.broadcast.emit('message',data);
        });
        client.on('disconnect',()=>{
//            console.log('client disconnected id='+list_of_users[id]+' id='+id);
            client.broadcast.emit('add users',{'delate':id});
            delete list_of_users[id];
//            console.log(io.engine.clientsCount);
        });
    }catch (e){
    
        console.log(e);
        client.disconnect();
    }

   
});
