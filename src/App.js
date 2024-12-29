import React, { useState } from 'react';
import './App.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskList, TaskItem } from './extensions/TaskListExtension';

const App = () => {
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem,
    ],
    content: '',
  });

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        id: Date.now(), // Unique ID for each task
        text: newTask,
        checked: false,
      };
      setTaskList((prevTasks) => [...prevTasks, newTaskItem]);
      setNewTask('');
    }
  };

  const handleTaskStatusChange = (id) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const handleEditTask = (id, newText) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="App">
      <h1>Task Checklist Editor</h1>
      <div className="task-input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {taskList.map((task) => (
          <li key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.checked}
              onChange={() => handleTaskStatusChange(task.id)}
            />
            {task.checked ? (
              <span className="completed">{task.text}</span>
            ) : (
              <span>{task.text}</span>
            )}
            <button onClick={() => handleEditTask(task.id, prompt('Edit task', task.text))}>
              Edit
            </button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <EditorContent editor={editor} />
    </div>
  );
};

export default App;
