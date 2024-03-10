import { Request, Response } from 'express'
import { QRCodeCanvas } from '@loskir/styled-qr-code-node'
import Joi from 'joi'

export const getQR = async (req : Request, res : Response) => {
    const validator = Joi.object({
        size : Joi.number().default(300).max(1200).min(100).integer(),
        data : Joi.string().required(),
        shape: Joi.string().valid('dot', 'square').default('square'),
        color: Joi.string().hex({ prefix: false }).default('000000')
    })

    const data = validator.validate(req.query)
    const color = `#${data.value.color}`

    if (data.error != null){
        res.status(400).json({
            status: 400,
            message: data.error.message,
            query: req.query
        })
        return
    }
    
    const size = Number.parseInt(data.value.size)
    
    const qr = new QRCodeCanvas({
        width: size,
        height: size,
        data: data.value.data,

        cornersDotOptions:{
            type: 'square',
            color: color
        },

        cornersSquareOptions:{
            type: data.value.shape == 'dot' ? 'extra-rounded' : 'square',
            color: color
        },

        dotsOptions: {
            type: data.value.shape == 'dot' ? 'rounded' : 'square',
            color: color
        }
    })

    res.setHeader('Content-Type', 'image/png').send(await qr.toBuffer('png'))
}