# 🩺 MedLink – Doctor Appointment Management System

A modern, responsive Doctor Appointment Management System built with **React/Next.js**, **TypeScript**, and **Tailwind CSS**.  
MedLink connects patients and doctors in one seamless platform – enabling **registration, login, doctor directory, appointment booking, and schedule management**.  

🚀 **Live Demo:** [Your Deployed URL](https://your-deployment-url.com)  
📦 **API Base URL:** [Appointment Manager API](https://appointment-manager-node.onrender.com/api/v1)  


```sh
# Step 1: Clone the repository using the project Git URL
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Start the development server (auto-reloading & instant preview)
npm run dev
```

## What technologies are used for this project?

This project is built with:

⚡ Vite – lightning-fast dev server
⚛️ React – UI framework
🟦 TypeScript – type-safe development
🎨 Tailwind CSS – modern styling
🧩 shadcn-ui – prebuilt UI components

## 📌 Features

### 👤 Authentication & Registration
- **Login** with email, password, and role (Doctor/Patient)  
- **Tabbed Registration**:  
  - Patient: `name, email, password, photo_url?`  
  - Doctor: `name, email, password, specialization, photo_url?`  
- **Form validation** with error handling  

### 🧑‍⚕️ Patient Dashboard
- **Doctor Directory** (paginated & searchable)  
  - Doctor cards with photo, name, and specialization  
  - **Search by name** (real-time)  
  - **Filter by specialization**  
  - **Pagination** for large datasets  
  - **Book Appointment** modal with date picker  
- **My Appointments**  
  - View all appointments by status (Pending, Cancelled, Completed)  
  - Cancel pending appointments with confirmation  

### 🩺 Doctor Dashboard
- **Appointment List** (paginated) with patient details, date, and status  
- **Filter by status** (Pending, Completed, Cancelled)  
- **Filter by date**  
- Update status: **Mark as Completed / Cancelled** (with confirmation dialogs)  


###🎨 UI/UX Guidelines

- Modern and clean Tailwind-based design
- Mobile-first responsive layout
- Loading states & error handling
- Success/error notifications
- Accessibility compliance