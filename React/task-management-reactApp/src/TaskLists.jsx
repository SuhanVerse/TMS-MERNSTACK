
const TaskLists = () => {
  return (
    <div className='taskListContainer'>
        <div className='taskLists'>
            <p>Task Number 1</p>
            <div>
            <i className="bi bi-pencil-square"></i>
            <i className="bi bi-trash" style={{color: 'red'}}></i>
            </div>

        </div>

        <div className='taskLists'>
            <p>Task Number 2</p>
            <div>
            <i className="bi bi-pencil-square"></i>
            <i className="bi bi-trash" style={{color: 'red'}}></i>
            </div>

        </div>

        <div className='taskLists'>
            <p>Task Number 3</p>
            <div>
            <i className="bi bi-pencil-square"></i>
            <i className="bi bi-trash" style={{color: 'red'}}></i>
            </div>

        </div>



    </div>
  )
}

export default TaskLists