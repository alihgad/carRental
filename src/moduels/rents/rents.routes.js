import { Router } from "express";
import * as RC from './rents.controler.js'

const router = Router()


router.post('/',RC.addRent)
router.get('/',RC.getRents)
router.get('/:id',RC.getOneRent)
router.put('/:id',RC.updateRent)
router.delete('/:id',RC.deleteRent)










export default router