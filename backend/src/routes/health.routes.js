import { Router } from 'express'
import db from '../database/index.js'

const router = Router()

router.get('/health', async(req, res) => {
  try{
    await db.query('SELECT 1')
    return res.json({database: 'ok'})
  } catch (error) {
    return res.status(500).json({database: 'error'})
  }
})

export default router
