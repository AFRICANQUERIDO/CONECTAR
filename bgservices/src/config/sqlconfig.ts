import dotenv from 'dotenv'

dotenv.config()

// console.log(process.env.DB_NAME);


export const sqlConfig1 = {
    user: process.env?.['DB_USER'] as string ,
    password: process.env?.['DB_PWD'] as string ,
    database: process.env?.['DB_NAME'] as string,
    server: process.env?.['SERVER'] as string ,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

console.log(sqlConfig1);