
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Column as ColumnType, Task as TaskType } from '@/types';
import Column from './Column';
import CreateColumnButton from './CreateColumnButton';

// Sample initial data for demonstration
const initialColumns: ColumnType[] = [
  {
    id: uuidv4(),
    title: 'To Do',
    tasks: [
      {
        id: uuidv4(),
        title: 'Research user needs',
        description: 'Conduct interviews with potential users to understand their requirements',
        priority: 'high',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Design wireframes',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'In Progress',
    tasks: [
      {
        id: uuidv4(),
        title: 'Implement authentication',
        description: 'Set up user registration and login flows',
        priority: 'high',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Review',
    tasks: []
  },
  {
    id: uuidv4(),
    title: 'Done',
    tasks: [
      {
        id: uuidv4(),
        title: 'Project setup',
        description: 'Initialize repository and configure build tools',
        priority: 'low',
        createdAt: new Date().toISOString(),
      }
    ]
  }
];

const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  // Create a new column
  const handleCreateColumn = (title: string) => {
    const newColumn: ColumnType = {
      id: uuidv4(),
      title,
      tasks: []
    };
    
    setColumns([...columns, newColumn]);
  };

  // Update a column title
  const handleUpdateColumn = (columnId: string, newTitle: string) => {
    setColumns(columns.map(column => 
      column.id === columnId ? { ...column, title: newTitle } : column
    ));
  };

  // Delete a column
  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  // Create a new task
  const handleCreateTask = (columnId: string, title: string, priority: 'low' | 'medium' | 'high') => {
    const newTask: TaskType = {
      id: uuidv4(),
      title,
      priority,
      createdAt: new Date().toISOString()
    };
    
    setColumns(columns.map(column => 
      column.id === columnId 
        ? { ...column, tasks: [...column.tasks, newTask] } 
        : column
    ));
  };

  // Edit a task
  const handleEditTask = (columnId: string, taskId: string, updatedTask: Partial<TaskType>) => {
    setColumns(columns.map(column => 
      column.id === columnId 
        ? { 
            ...column, 
            tasks: column.tasks.map(task => 
              task.id === taskId ? { ...task, ...updatedTask } : task
            ) 
          } 
        : column
    ));
  };

  // Delete a task
  const handleDeleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(column => 
      column.id === columnId 
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) } 
        : column
    ));
  };

  return (
    <div className="board-container">
      {columns.map((column) => (
        <Column 
          key={column.id} 
          column={column}
          onUpdateColumn={handleUpdateColumn}
          onDeleteColumn={handleDeleteColumn}
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      ))}
      <CreateColumnButton onCreateColumn={handleCreateColumn} />
    </div>
  );
};

export default Board;
