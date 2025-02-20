export interface Task {
  id?: string;
  title: string;
  description?: string;
  assignedTo?: any;
  date: string;
  prio: string;
  category: string;
  subtasks?: any;
  typ: string;
}
