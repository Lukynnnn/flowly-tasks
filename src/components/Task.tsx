
import React from 'react';
import { Clock, MoreHorizontal, GripVertical } from 'lucide-react';
import { Task as TaskType } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskProps {
  task: TaskType;
  columnId: string;
  onEdit?: (task: TaskType) => void;
  onDelete?: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, columnId, onEdit, onDelete }) => {
  // Set up draggable behavior
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      columnId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  // Format the date to a readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get priority class
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      default:
        return 'priority-medium';
    }
  };

  // Get priority label
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return 'Medium';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="task-card animate-slide-up group"
      {...attributes}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div {...listeners} className="cursor-grab pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">{task.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-full opacity-70 hover:opacity-100 hover:bg-muted transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(task.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-3">
        <span className={`${getPriorityClass(task.priority)}`}>
          {getPriorityLabel(task.priority)}
        </span>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
