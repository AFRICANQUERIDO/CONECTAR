import mssql from 'mssql'
import { sqlConfig1 } from '../config/sqlconfig';




export default class Connection {
    getUserByEmail(email: any) {
        throw new Error("Method not implemented.");
    }

    private pool: Promise<mssql.ConnectionPool>

    constructor() {
        this.pool = this.getConnection()
    }

    getConnection(): Promise<mssql.ConnectionPool> {
        const pool = mssql.connect(sqlConfig1) as Promise<mssql.ConnectionPool>;

        return pool
    }

    createRequest(request: mssql.Request, data: { [c: string | number]: string | number }) {
        const keys = Object.keys(data)

        keys.map((keyName) => {
            const keyValue = data[keyName]
            request.input(keyName, keyValue)
        })

        return request
    }

    async execute(procedureName: string, data: { [c: string | number]: string | number } = {}) {
        let pool = await this.pool

        let request = (await pool.request()) as mssql.Request

        request = this.createRequest(request, data)

        const result = await request.execute(procedureName)

        return result
    }

    async query(query: string) {
        const result = (await this.pool).request().query(query)

        return result
    }

}