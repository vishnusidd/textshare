import React, { useState } from 'react';

function Option2() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [project, setProject] = useState('default'); // Group tasks into projects
  const [newLabel, setNewLabel] = useState('');
  const [priority, setPriority] = useState('medium'); // low, medium, high
  const [dueDate, setDueDate] = useState('');
  const [newSubTask, setNewSubTask] = useState(''); // For adding sub-tasks

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        project,
        label: newLabel,
        priority,
        dueDate,
        subTasks: [], // Initialize with an empty sub-task array
        showSubTaskInput: false, // Initially hide sub-task input
      },
    ]);
    setNewTask('');
    setNewLabel('');
    setPriority('medium');
    setDueDate('');
  };

  const addSubTask = (taskId) => {
    if (newSubTask.trim() === '') return;
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [
                ...task.subTasks,
                { id: Date.now(), text: newSubTask, completed: false },
              ],
            }
          : task
      )
    );
    setNewSubTask('');
  };

  const calculateCompletionPercentage = () => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0; // Avoid division by zero
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const calculateSubTaskCompletionPercentage = (task) => {
    const totalSubTasks = task.subTasks.length;
    if (totalSubTasks === 0) return 0; // Avoid division by zero
    const completedSubTasks = task.subTasks.filter((subTask) => subTask.completed).length;
    return Math.round((completedSubTasks / totalSubTasks) * 100);
  };
  
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleSubTaskCompletion = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const deleteSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter((subTask) => subTask.id !== subTaskId),
            }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Advanced To-Do List with Sub-Tasks</h2>
      <p style={styles.completionText}>
    Completion: {calculateCompletionPercentage()}%
      </p>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          style={styles.input}
        />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add a label"
          style={styles.input}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addButton}>
          Add Task
        </button>
      </div>
      <div style={styles.filterContainer}>
        <button onClick={() => setFilter('all')} style={styles.filterButton}>
          All
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={styles.filterButton}
        >
          Completed
        </button>
        <button onClick={() => setFilter('pending')} style={styles.filterButton}>
          Pending
        </button>
      </div>
      <ul style={styles.taskList}>
  {filteredTasks.map((task) => (
    <li key={task.id} style={styles.taskItem}>
      <div style={styles.taskContent}>
        {/* Award Icon */}
        {calculateSubTaskCompletionPercentage(task) === 100 && (
          <span style={styles.awardIcon}>🏆</span>
        )}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTaskCompletion(task.id)}
          style={styles.checkbox}
        />
        <span
          style={{
            ...styles.taskText,
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
        >
          {task.text}
        </span>
        <span style={styles.label}>[{task.label}]</span>
        <span style={styles.priority}>Priority: {task.priority}</span>
        <span style={styles.dueDate}>
          Due: {task.dueDate || 'No deadline'}
        </span>
        <span style={styles.subTaskCompletion}>
          Sub-Tasks: {calculateSubTaskCompletionPercentage(task)}%
        </span>
        <button
          onClick={() => deleteTask(task.id)}
          style={styles.deleteButton}
        >
          Delete
        </button>
        <button
          onClick={() =>
            setTasks(
              tasks.map((t) =>
                t.id === task.id
                  ? { ...t, showSubTaskInput: !t.showSubTaskInput }
                  : t
              )
            )
          }
          style={styles.addSubTaskButton}
        >
          ➕ Add Sub-Task
        </button>
      </div>
      {/* Conditionally Render Sub-Task Input */}
      {task.showSubTaskInput && (
        <div style={styles.subTaskContainer}>
          <input
            type="text"
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            placeholder="Add a sub-task"
            style={styles.input}
          />
          <button
            onClick={() => addSubTask(task.id)}
            style={styles.addButton}
          >
            Add Sub-Task
          </button>
        </div>
      )}
      {/* Sub-Tasks */}
      <ul style={styles.subTaskList}>
        {task.subTasks.map((subTask) => (
          <li key={subTask.id} style={styles.subTaskItem}>
            <div style={styles.subTaskContent}>
              <input
                type="checkbox"
                checked={subTask.completed}
                onChange={() =>
                  toggleSubTaskCompletion(task.id, subTask.id)
                }
                style={styles.checkbox}
              />
              <span
                style={{
                  ...styles.taskText,
                  textDecoration: subTask.completed
                    ? 'line-through'
                    : 'none',
                }}
              >
                {subTask.text}
              </span>
              <button
                onClick={() => deleteSubTask(task.id, subTask.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: '1 1 200px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  filterButton: {
    padding: '10px 15px',
    fontSize: '14px',
    margin: '0 5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  taskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  subTaskContainer: {
    marginLeft: '40px', // Indent the sub-task input to the right
    marginTop: '10px',
  },
  subTaskList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
    marginLeft: '40px', // Indent the sub-task list to the right
  },
  subTaskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px', // Add spacing between sub-tasks
  },
  subTaskContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  taskText: {
    fontSize: '16px',
    cursor: 'pointer',
  },
  label: {
    marginLeft: '10px',
    fontSize: '14px',
    color: '#555',
  },
  priority: {
    marginLeft: '10px',
    fontSize: '14px',
    color: '#007bff',
  },
  dueDate: {
    marginLeft: '10px',
    fontSize: '14px',
    color: '#dc3545',
  },
  deleteButton: {
    padding: '5px 10px',
    fontSize: '14px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addSubTaskButton: {
    padding: '5px 10px', // Same padding as deleteButton
    fontSize: '14px', // Same font size as deleteButton
    backgroundColor: '#17a2b8', // Different color for distinction
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px', // Add spacing between buttons
  },
  checkbox: {
    cursor: 'pointer',
  },
  completionText: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#28a745',
  },
};

export default Option2;