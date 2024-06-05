import { ObjectId } from "mongodb";
import db from "../../../DB/connectionDB.js"
import bcrypt from 'bcryptjs'


const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const comparePassword = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
}




export const getUsers = async (req, res, next) => {
    const data = await db.collection('users').find({}).toArray();
    res.json({ msg: 'done', data })
}


export const addUser = async (req, res, next) => {
    const { name, email, password, phone } = req.body
    const user = await db.collection('users').findOne({ email })
    if (user) {
        return res.json({ msg: 'user already exists' })
    }
    const hashedPassword = await hashPassword(password)

    const data = await db.collection('users').insertOne({ name, email, password: hashedPassword, phone })
    return res.json({ msg: 'done' })

}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params
    const data = await db.collection('users').deleteOne({ _id: new ObjectId(id) })
    if (!data.deletedCount) {
        return res.json({ msg: "user not exist" })

    }
    res.json({ msg: 'done' })
}

export const updateUser = async (req, res, next) => {
    const { id } = req.params
    console.log(id);
    const { name, email , password } = req.body
    let msg = ''

    if (name !== undefined) {
        const data = await db.collection('users').updateOne({ _id: new ObjectId(id)  }, {$set: {name} })
        console.log(data);

        if (!data.modifiedCount) {
            return res.json({ msg: "user not exist" })
        }

        msg += 'name updated '
    }

    if (email !== undefined) {
        const data = await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set : {email} })

        if (!data.modifiedCount) {
            return res.json({ msg: "user not exist" })
        }
        msg += ' email updated'


    }

    if (password !== undefined) {
        const hashedPassword = await hashPassword(password)
        const data = await db.collection('users').updateOne({ _id: new ObjectId(id) }, {$set: {password:hashedPassword} })

        if (!data.modifiedCount) {
            return res.json({ msg: "user not exist" })
        }

        msg += ' password updated'


    }

    if (phone !== undefined) {
        const data = await db.collection('users').updateOne({ _id: new ObjectId(id) }, {$set: {phone} })

        if (!data.modifiedCount) {
            return res.json({ msg: "user not exist" })
        }

        msg += ' phone updated'


    }

    return res.json({ msg })


}


export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await db.collection('users').findOne({ email })
    if (!user) {
        return res.json({ msg: "user not exist" })
    }
    const match = await comparePassword(password , user.password)
    if (!match) {
        return res.json({ msg: "password not match" })
    }
    res.json({ msg: "log in", user })
}


export const getOneUser = async (req, res, next)=>{
    const {id} = req.params
    const user = await db.collection('users').findOne({_id:new ObjectId(id)})
    if(!user){
        return res.json({msg:"user not exist"})
    }

    const rents = await db.collection("rents").find({}).toArray()
    let userRents = []

    rents.map((rent)=>{
        if(rent.userId == id){
            userRents.push(rent)
        }
    })

    if(userRents.length > 0){
        user.rents = userRents
    }

    res.json({msg:"done",user})
}


