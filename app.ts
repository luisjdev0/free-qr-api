import dotenv from 'dotenv'
dotenv.config()

import compression from 'compression'
import cors from 'cors'
import { createServer } from "http"
import express, { Request, Response, NextFunction } from "express"

import { getQR, postQR } from './helpers/qr-manager'
import AuthAPIMiddleware from './helpers/ApiAuthMiddleware'

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

app.use(AuthAPIMiddleware)
app.post('/', postQR)

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Not found'
    })
})

const { SERVER_PORT } = process.env

server.listen(SERVER_PORT, () => {
    
    console.log(`Servidor levantado en http://127.0.0.1:${SERVER_PORT}`)
})