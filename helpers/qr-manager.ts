import { Request, Response } from 'express'
import { QRCodeCanvas } from '@loskir/styled-qr-code-node'
import Joi from 'joi'

const gradientTemplate = Joi.object({
    type: Joi.string().valid('linear', 'radial').default('linear'),
    rotation: Joi.number().min(0).max(360),
    colorStops: Joi.array().items(
        Joi.object({ color: Joi.string().pattern(/^#([0-9A-Fa-f]{6})$/), offset: Joi.number().min(0).max(1).default(0)})
    )
})
const colorPattern = Joi.string().pattern(/^#([0-9A-Fa-f]{6})$/).default('#000000')

export const getQR = async (req : Request, res : Response) => {
    const validator = Joi.object({
        size : Joi.number().default(300).max(1200).min(100).integer(),
        data : Joi.string().required(),
        shape: Joi.string().valid('dots', 'rounded', 'square').default('square'),
        color: colorPattern,
    })

    const data = validator.validate(req.query)

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

        dotsOptions: {
            type: data.value.shape,
            color: data.value.color
        }
    })

    res.setHeader('Content-Type', 'image/png').send(await qr.toBuffer('png'))
}

export const postQR = async (req: Request, res: Response) => {

    const validator = Joi.object({

        data : Joi.string().required(),
        size : Joi.number().default(300).max(1200).min(100).integer(),
        margin : Joi.number().integer(),

        image: Joi.string().uri(),

        backgroundOptions : Joi.object({
            color: colorPattern,
            gradient: gradientTemplate
        }),
        
        dotsOptions : Joi.object({
            type: Joi.string().valid(
                'classy',
                'classy-rounded',
                'dots',
                'extra-rounded',
                'rounded',
                'square'
            ).default('square'),
            color: colorPattern,
            gradient: gradientTemplate
        }),

        cornersSquareOptions: Joi.object({
            type: Joi.string().valid('dot', 'extra-rounded', 'square').default('square'),
            color: colorPattern,
            gradient: gradientTemplate
        }),

        cornersDotOptions: Joi.object({
            type: Joi.string().valid('dot', 'square').default('square'),
            color: colorPattern,
            gradient: gradientTemplate
        })

    })

    const data = validator.validate(req.body)
    if (data.error != null){
        res.status(400).json({
            status: 400,
            message: data.error.message,
            query: req.query
        })
        return
    }

    try{
        const size = Number.parseInt(data.value.size)

        const qrParams: any = {
            width: size,
            height: size,
            data: data.value.data,
            image: data.value.image
        }

        if (data.value.dotsOptions != null) qrParams.dotsOptions = data.value.dotsOptions
        if (data.value.backgroundOptions != null) qrParams.backgroundOptions = data.value.backgroundOptions
        if (data.value.cornersSquareOptions != null) qrParams.cornersSquareOptions = data.value.cornersSquareOptions
        if (data.value.cornersDotOptions != null) qrParams.cornersDotOptions = data.value.cornersDotOptions
        
        const qr = new QRCodeCanvas(qrParams)

        res.setHeader('Content-Type', 'image/png').send(await qr.toBuffer('png'))
        return

    } catch (error : any) {
        res.setHeader('Content-Type', 'application/json').status(400).json({
            status: 400,
            message: error.message
        })
        return
    }
}