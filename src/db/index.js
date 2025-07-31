import mongoose, { modelNames } from "mongoose"
import { db_name } from "../constant.js"

export const db_connected = async () => {
   try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)

       console.log(`Database connected : DB HOST : ${connectionInstance.connection.host}`);
       
   } catch (error) {
          console.log('Database connection failed ' , error.message);
           
           process.exit(1)
   }
}