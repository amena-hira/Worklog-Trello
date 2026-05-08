import { Assignee } from "./assignee";

export interface Task {
  id?: number;
  name?: string;
  description?: string;
  priority?: string;
  isCompleted?: boolean;
  dueDate?: Date;
  created?:Date;
  modified?:Date;
  completed?:Date;
  projectId?: number;
  projectName?: string;
  projectColor?: string;
  createdByUserEmail?: string;
  assignees?: Assignee[];
}
