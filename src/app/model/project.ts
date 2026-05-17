
export interface ProjectMember {
  userId?: number;
  userName?: string;
  userEmail?: string;
  role?: string;
}

export interface Project {
  id?: number;
  name?: string;
  description?: string;
  color?: string;
  dueDate?: Date;
  created?: Date;
  modified?: Date;
  completed?: Date | null;
  createdByUserEmail?: string;
  members?: ProjectMember[];
  totalTasks?: number;
  completedTasks?: number;
  tasksDue?: number;
  progress?: number;
}
