import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT ?? 4012

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'mining-backend',
        timestamp: new Date().toISOString(),
    })
})

app.listen(PORT, () => {
    console.log(`⚡ Backend ready on port ${PORT}`)
})
