
import React, { useState } from 'react';
import type { Task, TaskTag } from '../types';
import { TASK_TAGS } from '../constants';
import { PlusIcon, Trash2Icon, Edit2Icon, CheckIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string, newTag: TaskTag) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [editTag, setEditTag] = useState<TaskTag>(task.tag);

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(task.id, editText.trim(), editTag);
            setIsEditing(false);
        }
    };
    
    const tagColors: Record<TaskTag, string> = {
        'Study': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        'Work': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        'Gym': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        'Deep Work': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        'Personal': 'bg-green-500/20 text-green-300 border-green-500/30',
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow bg-transparent focus:outline-none"
                />
                <select value={editTag} onChange={e => setEditTag(e.target.value as TaskTag)} className="bg-white/10 rounded px-2 py-1 text-xs">
                     {TASK_TAGS.map(tag => <option key={tag} value={tag} className="bg-gray-800">{tag}</option>)}
                </select>
                <button onClick={handleSave} className="p-2 text-green-400 hover:text-green-300"><CheckIcon className="w-4 h-4" /></button>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg transition-all duration-300 ${task.completed ? 'opacity-50' : ''}`}>
            <button onClick={() => onToggle(task.id)} className={`w-6 h-6 rounded-full border-2 ${task.completed ? 'border-purple-400 bg-purple-400' : 'border-white/30'} flex items-center justify-center transition-all`}>
                {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
            </button>
            <span className={`flex-grow ${task.completed ? 'line-through text-white/50' : 'text-white/90'}`}>{task.text}</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${tagColors[task.tag]}`}>{task.tag}</span>
            <button onClick={() => setIsEditing(true)} className="p-2 text-white/50 hover:text-white/90"><Edit2Icon className="w-4 h-4" /></button>
            <button onClick={() => onDelete(task.id)} className="p-2 text-white/50 hover:text-red-400"><Trash2Icon className="w-4 h-4" /></button>
        </div>
    );
};


interface TaskManagerProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTag, setSelectedTag] = useState<TaskTag>('Personal');

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      tag: selectedTag,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const editTask = (id: string, newText: string, newTag: TaskTag) => {
    setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? { ...task, text: newText, tag: newTag } : task))
    );
  };

  return (
    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10">
      <h2 className="text-lg font-semibold mb-4 text-white/90">Task Manager</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
        ))}
         {tasks.length === 0 && <p className="text-center text-white/50 py-4">Add a task to begin your focus journey.</p>}
      </div>
      <div className="mt-4 flex gap-2 items-center p-2 bg-white/10 rounded-lg">
        <input
          type="text"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-grow bg-transparent focus:outline-none px-2"
        />
        <select value={selectedTag} onChange={e => setSelectedTag(e.target.value as TaskTag)} className="bg-white/10 rounded px-2 py-1 text-xs appearance-none focus:outline-none">
            {TASK_TAGS.map(tag => <option key={tag} value={tag} className="bg-gray-800">{tag}</option>)}
        </select>
        <button onClick={addTask} className="p-2 bg-purple-600/50 hover:bg-purple-600/80 rounded-md text-white">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
