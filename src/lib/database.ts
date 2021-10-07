
import chalk from 'chalk';
import {MongoClient} from 'mongodb';

class Database {
    async init(){
        const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:27017/greaser';
        const client = await MongoClient.connect(
            MONGO_DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        const db = client.db();
        if (client.isConnected()){
            console.log('********************* Base De Datos *********************');
            console.log(` ESTADO ${chalk.greenBright('EN LINEA')}`);
            console.log(` DB ${chalk.greenBright(db.databaseName)}`);
            console.log('*********************************************************');
        }
        return db;
    }
}

export default Database;