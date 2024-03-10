require('dotenv').config()
import compression from 'compression'
import cors from 'cors'
import { createServer } from "http"
import express, { Request, Response, NextFunction } from "express"

import { getQR, postQR } from './helpers/qr-manager'

const app = express()
const server = createServer(app)

app.use(compression())
app.use(cors())
app.use(express.json())

app.use((err : any, req : Request, res : Response, next : NextFunction) => {

    if (err instanceof SyntaxError && 'body' in err){
        return res.status(400).json({ status: 400, mensaje: 'Invalid JSON' });
    }
    next()
})

app.get('/', getQR)
app.post('/', postQR)

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Not found'
    })
})

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor levantado en 127.0.0.1:${process.env.SERVER_PORT}`)
})