import express from 'express'
import cors from 'cors'
import usersRouter from './src/moduels/users/users.routes.js'
import carsRouter from './src/moduels/cars/cars.routes.js'
import rentsRouter from './src/moduels/rents/rents.routes.js'
const app = express()
const port =  process.env.PORT


app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)
app.use('/cars', carsRouter)
app.use('/rents', rentsRouter)
app.use('*',(res)=>{res.json({msg:'notfound'}).status(404)})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))