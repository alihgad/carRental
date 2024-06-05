import { ObjectId } from "mongodb";
import db from "../../../DB/connectionDB.js";


export const addRent = async (req, res) => {
    const { userId, carId, rentDate, returnDate } = req.body

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!user) {
        return res.json({ msg: "no such user" })
    }

    const car = await db.collection('cars').findOne({ _id: new ObjectId(carId) })
    if (!car) {
        return res.json({ msg: "no such car" })
    }

    if (new Date(rentDate) > new Date(returnDate)) {
        return res.json({ msg: "return date must be after rent date" })
    }

    if (car.status === 'rented') {
        return res.json({ msg: "car not available" })
    }



    const data = await db.collection('rents').insertOne({ userId:new ObjectId(userId), carId : new ObjectId(carId), rentDate, returnDate })
    const datas = await db.collection('cars').updateOne({ _id: new ObjectId(carId) } , {$set:{status:"rented"}})
    return res.json({ msg: "done successfully" })

}


export const updateRent = async (req, res) => {
    const { id } = req.params
    const { returnDate } = req.body
     const rent  = await db.collection('rents').findOne({_id:new ObjectId(id)})

    if (new Date(rent.rentDate) > new Date(returnDate)) {
        return res.json({ msg: "return date must be after rent date" })
    }

    const data = await db.collection('rents').updateOne({ _id: new ObjectId(id) }, { $set: {  returnDate } })
    return res.json({ msg: "done" })

}


export const getRents = async (req, res) => {
    const data = await db.collection('rents').find({}).toArray()

    for (let i = 0; i < data.length; i++) {
        const car = await db.collection('cars').findOne({ _id:data[i].carId })
        const user = await db.collection('users').findOne({ _id:data[i].userId })

        data[i].car = car
        data[i].user = user
    }



    return res.json({ msg: "done", data })
}

export const getOneRent = async (req, res) => {
    let { id } = req.params
    const data = await db.collection('rents').findOne({ _id: new ObjectId(id)  })
    const car = await db.collection('cars').findOne({ _id: data.carId })
    const user = await db.collection('users').findOne({ _id: data.userId })

    data.car = car
    data.user = user
    return res.json({ msg: "done", data })

}

export const deleteRent = async (req, res) => {
    let { id } = req.params
    const rent = await db.collection('rents').findOne({ _id: new ObjectId(id) })
    if(!rent){
        return res.json({msg:"no such rent"})
    }
    const car = await db.collection('cars').updateOne({ _id:rent.carId }, { $set: { status: "available" } })
    const data = await db.collection('rents').deleteOne({ _id: new ObjectId(id) })
    return res.json({ msg: "done" })
}