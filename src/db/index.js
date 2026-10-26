import mongoose from "mongoose";

const MAX_RETRIES =3;
const RETRY_INTERVAL=5000;

class DatabaseConnection {
    constructor(){
        this.retrycount =0;
        this.isConnected =false;

        mongoose.set('strictQuery', true);

        mongoose.connection.on("connected",()=>{
            console.log("Mongoose is connected succesfully");
            this.isConnected=true;
        })
        mongoose.connection.on("error",(err)=>{
            console.error('❌ MongoDB connection error:', err);
            this.isConnected = false;
        });

    }
   async connect() {
        try {
            if (!process.env.MONGO_URI) {
                throw new Error('MongoDB URI is not defined in environment variables');
            }

            const connectionOptions = {
           
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4, // Use IPv4
            };

            if (process.env.NODE_ENV === 'development') {
                mongoose.set('debug', true);
            }

            await mongoose.connect(process.env.MONGO_URI, connectionOptions);
            this.retryCount = 0; // Reset retry count on successful connection
            
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error.message);
            await this.handleConnectionError();
        }
    }
    async handleConnectionError() {
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount++;
            console.log(`Retrying connection... Attempt ${this.retryCount} of ${MAX_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
            return this.connect();
        } else {
            console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
            process.exit(1);
        }
    }
        getConnectionStatus() {
            return {
                isConnected: this.isConnected,
                readyState: mongoose.connection.readyState,
                host: mongoose.connection.host,
                name: mongoose.connection.name
            };
        }
    }
    
    // Create a singleton instance

    const dbConnection = new DatabaseConnection();
    
    // Export the connect function and the instance
    export default dbConnection.connect.bind(dbConnection);
    export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
