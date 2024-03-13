
import dotenv from 'dotenv'

dotenv.config()
// const { DB_USER } = process.env
// console.log(DB_USER)

console.log(process.env?.['DB_NAME']);

export const sqlConfig = {
  user: process.env?.['DB_USER'] as string || 'sa',
  password: process.env?.['DB_PWD'] as string || 'sql.jane',
  database: process.env?.['DB_NAME'] as string || 'conectar',
  server: process.env?.['SERVER'] as string || 'DESKTOP-G3PNO3V',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

console.log(sqlConfig);