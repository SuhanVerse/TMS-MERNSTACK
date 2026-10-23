import express from 'express'
import cors from 'cors'
import TaskModel from './TaskModel.js'

const app = express()
app.use(express.json())
app.use(cors())
const taskRouter = express.Router()
app.use('/api/task', taskRouter)

taskRouter.post('/', async (req, res) => {
    const name = req.body?.name
    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).send({ error: 'A non-empty task name is required' })
    }
    try {
        const task = await new TaskModel({ name: name.trim() }).save()
        return res.status(201).send({ message: 'Created successfully', task })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ error: 'A task with this name already exists' })
        }
        return res.status(500).send({ error: 'Could not save the task' })
    }
})

export default app
