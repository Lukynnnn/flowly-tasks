
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CreateTaskButtonProps {
  onCreateTask: (title: string, priority: 'low' | 'medium' | 'high') => void;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ onCreateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title.trim(), priority);
      setTitle('');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="task-card animate-slide-up">
        <Input
          autoFocus
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <div className="mb-2">
          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm">Add Task</Button>
        </div>
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setIsEditing(true)}
      className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors"
      size="sm"
    >
      <Plus className="mr-1 h-4 w-4" />
      Add Task
    </Button>
  );
};

export default CreateTaskButton;
