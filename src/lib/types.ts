export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodoFormData = {
  title: string;
}; 