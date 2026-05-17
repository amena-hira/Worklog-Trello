# Re-Projet Descodeuses: Todo Application

## Overview
The **Todo Application** is a modern, responsive web-based task and project management dashboard. It allows users to organize their workflow by creating projects, assigning tasks to specific members, setting priorities and deadlines, and tracking completion statuses. It also includes an administrative panel for user management.

## Tech Stack
Based on the project structure and syntax, the application is built using:
* **Framework:** Angular (v17+, utilizing the new `@if`, `@for`, and `@empty` control flow blocks)
* **Styling:** Tailwind CSS along with **DaisyUI** components (`btn`, `card`, `modal`, `badge`, etc.)
* **Icons:** FontAwesome (`fa-solid`, `fa-regular`)
* **Forms:** Angular Reactive Forms (`[formGroup]`, `formControlName`)

---

## Prerequisites
Make sure you have the following installed on your machine:
* Node.js (v18 or higher recommended)
* Angular CLI (v17 or higher)
  ```bash
  npm install -g @angular/cli
  ```

## Installation & Setup

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <repository-url>
   cd "Re-Projet Descodeuses/Todo"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   ng serve
   ```

4. **View the application**: 
   Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

---

## Core Modules & Features

### 1. User Profile (`/profile`)
Provides a personalized dashboard for the currently logged-in user.
* **Profile Details:** Displays user avatar, name, email, and role.
* **Quick Actions:** Allows users to edit their profile (`<app-edit-profile>`) or sign out.
* **Statistics:** Displays summary cards for Total Tasks, Completed Tasks, Total Projects, and Active Projects.

### 2. Task Management (`/tasks`)
A comprehensive view for managing daily, upcoming, and completed tasks.
* **Filtering & Sorting:** Filter tasks by "All", "Today", "Tomorrow", "Next Week", and "Completed".
* **Dropdown Filters:** Filter by "All Projects", "Priority", and "Any date".
* **CRUD Operations:** Users can create, edit, and delete tasks dynamically.

### 3. Project Management (`/projects`)
Handles the broader scope of work through project categorization.
* **Project Filters:** Toggle between "All", "Active", and "Completed" projects.
* **Overdue Tracker:** Highlights projects that have passed their due date but are not yet completed (`<app-overdue-projects-list>`), displaying them with warning colors.
* **Project Details:** Shows total tasks, due date, creator avatar, and completion status.

### 4. Admin - User Management (`/admin/worklog-users`)
An administrative interface for managing platform access.
* **User Roster:** Displays a tabular list of all users, their emails, and their assigned roles.
* **Management Actions:** Admins can add new users, edit existing user profiles, or delete users using modular forms (`<app-form-delete>`).

---

## Key Shared Components

* **Form Modal (`<app-form-project-task>`):** A highly reusable, dynamic dialog component used for both creating and editing Projects and Tasks. Features include complex UI elements like assignees multi-select, priority selection, color coding pickers, and dynamic field visibility based on context.
* **Delete Confirmation (`<app-form-delete>`):** A reusable confirmation modal triggered before permanently removing items (Users, Projects, Tasks) to prevent accidental data loss.
* **Toast Notifications (`<app-toast>`):** A global notification system used to display error messages or success alerts across different views.

---

## UI/UX Design System
The project leverages the **DaisyUI** component library heavily, ensuring a consistent and accessible design system:
* **Layout:** Responsive `flex` and `grid` layouts, utilizing mobile-first design patterns (`md:flex-row`, `hidden md:flex`).
* **Modals:** HTML `<dialog>` elements combined with DaisyUI `.modal` classes for native, accessible popups.
* **Theming:** Extensive use of `base-100`, `base-200`, `base-content` utility classes allowing for easy dark/light mode switching.

---

## Building & Testing (Angular CLI)
* **Building:** Run `ng build` to compile the project. The build artifacts will be stored in the `dist/` directory.
* **Testing:** Run `ng test` to execute unit tests via Karma.
