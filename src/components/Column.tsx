
import React, { useState } from 'react';
import { MoreHorizontal, X, Check, GripVertical, Trash } from 'lucide-react';
import { Column as ColumnType, Task as TaskType } from '@/types';
import Task from './Task';
import CreateTaskButton from './CreateTaskButton';
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ColumnProps {
  column: ColumnType;
  onUpdateColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string, title: string, priority: 'low' | 'medium' | 'high') => void;
  onEditTask: (columnId: string, taskId: string, updatedTask: Partial<TaskType>) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  onUpdateColumn, 
  onDeleteColumn, 
  onCreateTask,
  onEditTask,
  onDeleteTask
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);

  const handleTitleSubmit = () => {
    if (title.trim() && title !== column.title) {
      onUpdateColumn(column.id, title);
    } else {
      setTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleCreateTask = (taskTitle: string, priority: 'low' | 'medium' | 'high') => {
    onCreateTask(column.id, taskTitle, priority);
  };

  const handleTaskEdit = (task: TaskType) => {
    // For now, just a placeholder. In a real app, you would open a modal or form
    console.log('Edit task:', task);
  };

  const handleTaskDelete = (taskId: string) => {
    onDeleteTask(column.id, taskId);
  };

  return (
    <div className="column-container animate-fade-in">
      <div className="column-header">
        {isEditingTitle ? (
          <div className="flex items-center w-full">
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-7 text-sm"
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitle(column.title);
                  setIsEditingTitle(false);
                }
              }}
            />
            <button 
              onClick={handleTitleSubmit}
              className="ml-1 p-1 hover:bg-accent rounded-full"
            >
              <Check className="h-4 w-4 text-green-500" />
            </button>
            <button 
              onClick={() => {
                setTitle(column.title);
                setIsEditingTitle(false);
              }}
              className="p-1 hover:bg-accent rounded-full"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <GripVertical className="h-4 w-4 mr-2 text-muted-foreground opacity-50" />
            <span
              className="cursor-pointer hover:text-primary"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </span>
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {column.tasks.length}
            </span>
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-full opacity-70 hover:opacity-100 hover:bg-muted transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDeleteColumn(column.id)}
              className="text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="column-content">
        {column.tasks.map((task) => (
          <Task 
            key={task.id} 
            task={task}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
          />
        ))}
      </div>
      
      <div className="p-2 border-t">
        <CreateTaskButton onCreateTask={handleCreateTask} />
      </div>
    </div>
  );
};

export default Column;
