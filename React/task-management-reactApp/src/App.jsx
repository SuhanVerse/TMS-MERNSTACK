import './App.css'
import TaskInput from './TaskInput'
import TaskLists from './TaskLists'

function App() {
  return (
    <div className='mainContainer'>
      <h1>Task Management System</h1>
      <TaskInput />
      <TaskLists />
    </div>
  )
}

export default App
