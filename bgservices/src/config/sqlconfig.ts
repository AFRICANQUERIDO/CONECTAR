// import dotenv from 'dotenv'

// dotenv.config()

// console.log(process.env.DB_NAME);


export const sqlConfig1 = {
    user: "sa",
  password: "sql.jane",
  database: "Conectar",
  server: "DESKTOP-G3PNO3V",
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