import {Router} from 'express'
import { failure, payupay, success } from '../controllers/payu.controlle.js'

const router = Router()
router.post('/pay',payupay)
router.post('/success',success)
router.post('/failure',failure)

export default router;