
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Column as ColumnType, Task as TaskType } from '@/types';
import Column from './Column';
import CreateColumnButton from './CreateColumnButton';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

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
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

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

  // Drag start handler
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;

    // Find the task and its column
    for (const column of columns) {
      const foundTask = column.tasks.find(task => task.id === taskId);
      if (foundTask) {
        setActiveTask(foundTask);
        setActiveColumn(column.id);
        break;
      }
    }
  };

  // Drag over handler
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !active || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source column (where the task is dragged from)
    const activeColumnId = columns.find(col => 
      col.tasks.some(task => task.id === activeId)
    )?.id;

    // Find destination column (where task is dragged to)
    const overColumnId = over.data.current?.columnId || 
                         columns.find(col => col.id === overId)?.id || 
                         columns.find(col => col.tasks.some(task => task.id === overId))?.id;

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

    setColumns(prev => {
      // Find indices of the columns
      const activeColumnIndex = prev.findIndex(col => col.id === activeColumnId);
      const overColumnIndex = prev.findIndex(col => col.id === overColumnId);

      // Find the task from the active column
      const activeColumn = prev[activeColumnIndex];
      const taskIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
      
      if (taskIndex === -1) return prev;
      
      // Make a new array, removing the task from the source column
      const newColumns = [...prev];
      const [removedTask] = newColumns[activeColumnIndex].tasks.splice(taskIndex, 1);
      
      // Add the task to the destination column
      newColumns[overColumnIndex].tasks.push(removedTask);
      
      return newColumns;
    });
  };

  // Drag end handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }

    // Handle reordering within the same column
    setColumns(prev => {
      // Find the column that contains the task
      const columnIndex = prev.findIndex(col => 
        col.tasks.some(task => task.id === activeId)
      );

      if (columnIndex === -1) return prev;

      const column = prev[columnIndex];
      const taskIndices = column.tasks.map(task => task.id);
      
      const activeIndex = taskIndices.indexOf(activeId);
      const overIndex = taskIndices.indexOf(overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // Reorder within the same column
        const newColumns = [...prev];
        newColumns[columnIndex].tasks = arrayMove(
          newColumns[columnIndex].tasks,
          activeIndex,
          overIndex
        );
        return newColumns;
      }
      
      return prev;
    });

    setActiveTask(null);
    setActiveColumn(null);
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board-container">
        <SortableContext items={columns.map(col => col.id)}>
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
        </SortableContext>
        <CreateColumnButton onCreateColumn={handleCreateColumn} />
      </div>
    </DndContext>
  );
};

export default Board;
