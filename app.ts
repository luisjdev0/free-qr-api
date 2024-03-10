require('dotenv').config()
import { createServer } from "http"
import express from "express"
import cors from 'cors'
import { getQR } from './helpers/qr-manager'

const app = express()
const server = createServer(app)

app.use(cors())
app.use(express.json())

app.get('/qr', getQR)

server.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor levantado en 127.0.0.1:${process.env.SERVER_PORT}`)
})