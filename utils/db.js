
import mongoose from "mongoose";



const connect = async () =>{
    if(mongoose.connections[0].readyState) return

    try {
        await mongoose.connect(process.env.MONGODB_URL,{
          
        })
      console.log("Conectado a DB")
    } catch (error) {
        throw new Error("Error conectandose a la base de datos")
    }
}

export default connect