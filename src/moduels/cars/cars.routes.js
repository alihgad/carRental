import { Router } from "express";
import * as CC from './cars.controler.js'

const router = Router()


router.post('/',CC.addCar)
router.get('/',CC.getCars)
router.get('/availableOfModel/:name',CC.getAvailableOfModel)
router.get('/rentedOfModel/:name',CC.getRentedOfModel)
router.get('/rentedAndModel/:name',CC.getRentedOrModel)
router.get('/:id',CC.getOneCar)
router.put('/:id',CC.updateCar)
router.delete('/:id',CC.deleteCar)










export default router