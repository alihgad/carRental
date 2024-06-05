import { Router } from "express";
import * as UC from './users.controler.js'

const router = Router()


router.get('/',UC.getUsers)
router.get('/:id',UC.getOneUser)
router.post('/signup',UC.addUser)
router.post('/login',UC.login)
router.put('/:id',UC.updateUser)
router.delete('/:id',UC.deleteUser)










export default router