import { Router } from 'express'
import pool from '../database/index.js'

const router = Router()

router.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1')
    return res.status(200).json({
      database: 'ok',
      result: result.rows,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      database: 'error',
      error: error.message,
    })
  }
})

export default router
