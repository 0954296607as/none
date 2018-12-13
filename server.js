
const express = require('express');
const path=require ('path');
const socket=require('socket.io');
const baza=require('./baza');

const pathPublic=path.join(__dirname, '/public');
const app = express();
const port =process.env.PORT || 8080;
let list_of_users={};






app.use(express.static(pathPublic));

app.use(express.json());
app.post('/system.html/price', (req, res)=>{
        baza.getPrice(req.body.product,(err,data)=>{
                if(err){console.error('There is a mistake in the price-'+err);}
                        else{
                        res.send(data);
                        }
                });
});
app.post('/system.html/collection',(req,res)=>{
        baza.getCollection(req.body.product,(err,data)=>{
                if(err){console.error('There is a mistake in the collection-'+err)}
                        else{
                                res.send(data);
                        }
        });
});
app.post('/system.html/recipes',(req,res)=>{
        baza.getRecipes(req.body.product, req.body.color, (err,data)=>{
                if(err){console.error("There is a mistake in the recipes-"+err)}
                else{
                        res.send(data);
                }
        })
});
app.get('/system.html/pigments', (req, res)=>{
        //console.log(req.body.hello);
        baza.get_price_pigments((data)=>{
               res.send(data);
        });
});
        

let server= app.listen(port,'0.0.0.0',(err) => {
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
            client.emit('add users',list_of_users);
            list_of_users[id]=data;
            client.broadcast.emit('add users',{[id]: list_of_users[id]});


        });
        client.on('message', (data)=>{
            client.broadcast.emit('message',data);
        });
        client.on('disconnect',()=>{
            client.broadcast.emit('add users',{'delate':id});
            delete list_of_users[id];
        });
    }catch (e){
    
        console.log("There is a mistake in the database-"+e);
        client.disconnect();
    }

   
});
