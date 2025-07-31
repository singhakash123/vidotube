import dotenv from "dotenv"
import { db_connected } from "./db/index.js";
import { app } from "./app.js";


// dotenv config : 
dotenv.config({
      path :'./.env'
})

// port setup : 
const port = process.env.PORT || 5000

// db connection with server : 

db_connected()
.then(() =>{
     app.listen(port , () =>{
               console.log(`Server connection successfull PORT : ${port}`)
     })
})
.catch((error) =>{
               console.log(`Server connection failed with database` , error.message);

               process.exit(1)
})