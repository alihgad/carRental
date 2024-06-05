import { ObjectId } from "mongodb"
import db from "../../../DB/connectionDB.js"


export const addCar = async (req, res) => {
    const { name, model } = req.body
    let data = await db.collection("cars").insertOne({ name, model, status: "available" })
    res.json({ msg: 'success' })
}


export const getCars = async (req, res) => {
    let {name} = req.query
    let names = Array.isArray(name) ? name : [name] 

    let data = []
    if(name){
        data = await db.collection("cars").find({name:{$in:names}}).toArray()
        return res.json({ msg: 'success' , data})

    }else{
        data = await db.collection("cars").find({}).toArray()
        return res.json({ msg: 'success' , data})
    }
}

export const deleteCar = async (req, res) => {
    let { id } = req.params
    let data = await db.collection("cars").deleteOne({ _id: new ObjectId(id) })
    if (!data.deletedCount) {
        return res.status(404).json({ msg: "notfound" })

    }
    return res.json({ msg: "done" })
}

export const updateCar = async (req, res) => { 
    let{ id } = req.params
    let { name, model , status } = req.body
    let msg = ''

    if(name !== undefined){
        let data = await db.collection("cars").updateOne({ _id: new ObjectId(id) }, { $set: { name } })
        msg += "name updated "
    }

    if(model !== undefined){
        let data = await db.collection("cars").updateOne({ _id: new ObjectId(id) }, { $set: { model } })
        msg += "model updated "
    }

    if(status !== undefined){
        let data = await db.collection("cars").updateOne({ _id: new ObjectId(id) }, { $set: { status } })
        msg += "status updated "
    }

    return res.json({msg})
}

export const getOneCar = async (req, res) => {
    let { id } = req.params
    let data = await db.collection("cars").findOne({ _id: new ObjectId(id) })
    if (!data) {
        return res.status(404).json({ msg: "notfound" })
    }
    if(data.status === "rented"){
        const rent = await db.collection("rents").findOne({ carId : new ObjectId(id)})
        data.rentDetails = rent
    }
    return res.json({ msg: "done", data })
}

export const getAvailableOfModel = async (req, res) => {
    let { name } = req.params
    let data = await db.collection("cars").find({ name, status: "available" }).toArray()
    return res.json({ msg: "done", data })
}

export const getRentedOfModel = async (req, res) => {
    let { name } = req.params
    let data = await db.collection("cars").find({ name, status: "rented" }).toArray()
    return res.json({ msg: "done", data })
}

export const getRentedOrModel = async (req, res) => {
    let { name } = req.params
    let data = await db.collection("cars").find({ status: "rented" }).toArray()
    let model = await db.collection("cars").find({name}).toArray()


    return res.json({ msg: "done", data:[...data , ...model]})
}







 