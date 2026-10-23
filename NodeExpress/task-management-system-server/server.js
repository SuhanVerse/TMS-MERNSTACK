import mongoose from 'mongoose'
import app from './app.js'

const port = Number(process.env.PORT || 8080)
const databaseUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management'

try {
    await mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 10000 })
    app.listen(port, () => console.log(`Server is running at http://localhost:${port}`))
} catch {
    console.error('Could not connect to MongoDB. Check MONGODB_URI and database availability.')
    process.exitCode = 1
}
