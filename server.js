let express = require("express");
let app = express();
let router = express.Router();
let path = require("path");
let cors = require("cors");
let bodyParser = require("body-parser");
let http = require("http");

let db_config = {
    host:"127.0.0.1",
    port:27017,
    dbname:"shunya-assignment",
    auth:false
}
let mongoConnector = require("./db");
let dbconnect = new mongoConnector(db_config);
try {
    dbconnect.init()
}
catch(error){
    console.error("Error initializing database connection",error);
}
let routes = require("./routes")(router,dbconnect);
let server = http.createServer(app);
let express_session = require("express-session")({
        secret:"my-secret",
        resave:true,
        saveUninitialized:true
    });
let socket = require("socket.io")(server,{
    cors:{
        origin:"http://localhost:8080",
        methods:["GET", "POST"]
    }
});
let socket_session = require("socket.io-express-session");
let sw = require("socketio-wildcard")();

app.use(express_session);
socket.use(socket_session(express_session,{
    resave:true
}));
let collName = "notes";
let logicio = socket.of("/logicio");
logicio.use(sw);
logicio.on('connection',(sc)=>{
    sc.on("get-document",async (documentId)=>{
        sc.join(documentId);
        let data ="";
        let document= await dbconnect.findOne(collName,{documentId});
        if(!document){
            await dbconnect.insert(collName,{documentId},{documentId,data})
        }
        else data = document.data;
        sc.emit("load-document",data);
        sc.on("send-changes",(delta)=>{
            sc.broadcast.to(documentId).emit("receive-changes",delta); 
        });
        //saving the document
        sc.on("save-document",async(doc)=>{
            let doc_data = doc.ops[0].insert;
            if(doc_data){
                await dbconnect.update(collName,{documentId},{documentId,data:doc})
            }
            else console.log("nothing to save")
        })

        // get user listening
        sc.on("send-user-list",(obj)=>{
            let {userList,docId}=obj;
            if(userList && docId && userList.length>0){
                if(!process[docId])process[docId]=[];
                let arr = process[docId];
                for(let user of userList){
                    if(!arr.includes(user)){
                        arr.push(user);
                    }
                }
                process[docId] = arr;
                console.log("obj===",process[docId]);
                sc.emit("get-user-list",process[docId]);
                sc.broadcast.to(documentId).emit("get-user-list",process[docId])
            }
        });

        //remove user from active list
        sc.on("user-inactive",({user,docId})=>{
            if(!user) return;
            else{
                let userList = process[docId];
                console.log("before userlist: " , userList)
                if(userList.length<0) return
                userList.splice(userList.indexOf(user),1);
                console.log("after userlist: " ,userList)
                process[docId]=userList;
                sc.emit("get-user-list",process[docId]);
                sc.broadcast.to(documentId).emit("get-user-list",process[docId]);
                sc.disconnect(true)
            }
        })

        //api call socket
        sc.on("api-result",(result)=>{
            if(!result) return;
            sc.broadcast.to(documentId).emit("api-result-change",result);
        })

        // disconnecting socket
        sc.on('disconnect-client',()=>{
            console.log("closing socket")
            sc.disconnect(true)
        })
    })
    
})
app.use(cors({
    cors:{
        origin:"http://localhost:8080",
        methods:["GET", "POST"]
    }
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"/src/dist")));
app.use(routes);

var PORT = 5552
let onListen=()=>{
    console.log("server is listening on port ",PORT)
}
server.listen(PORT);
server.on("listening",onListen)



