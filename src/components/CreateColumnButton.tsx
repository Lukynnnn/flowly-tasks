
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateColumnButtonProps {
  onCreateColumn: (title: string) => void;
}

const CreateColumnButton: React.FC<CreateColumnButtonProps> = ({ onCreateColumn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateColumn(title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="animate-slide-up column-container bg-card p-3 min-h-[100px]">
        <Input
          autoFocus
          placeholder="Enter column title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm">Add Column</Button>
        </div>
      </form>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsEditing(true)}
      className="h-16 column-container border-dashed opacity-70 hover:opacity-100 transition-opacity"
    >
      <Plus className="mr-1 h-4 w-4" />
      Add Column
    </Button>
  );
};

export default CreateColumnButton;
