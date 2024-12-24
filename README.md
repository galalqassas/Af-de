# Scrum Board Setup

This repository contains a Scrum board organized for agile project management, focusing on stories, sprints, and epics. Below is an overview of the board's sections and functionality.

## Board Structure

### Tabs

1. **All Stories**: Displays a comprehensive list of all stories, including labels like `story`, `bug`, and `spike`. Use this view to see all tasks in one place.
2. **Next Sprint**: Displays tasks planned for the next sprint, divided into the following columns:
   - **Todo**: Tasks that haven't been started.
   - **In Progress**: Tasks currently being worked on.
   - **Done**: Completed tasks.
   - **Canceled**: Tasks that were canceled.
3. **My Stories for Next Sprint**: Similar to the Next Sprint view, but filtered for tasks assigned to the current user.
4. **My Current Sprint**: Displays stories assigned to the user for the current sprint with the same columns as above for tracking personal progress.
5. **Epics**: A timeline view for managing and scheduling epics. This allows for a high-level overview of long-term goals and major features.

### Columns and Labels

- **Todo**: Tasks that are planned but not started.
- **In Progress**: Tasks actively being worked on.
- **Pushed**: Work that needs to be reviewed.
- **Canceled**: Tasks that were removed from the sprint.
- **Labels**: Each story can be labeled as a `story`, `bug`, or `spike` for categorization and prioritization.

### Key Features

- **Story Points**: Tracks effort estimation for each story.
- **Filters**: Ability to filter tasks by labels, status, and assignees.
- **Timeline View (Epics)**: Visualize epic-level tasks over time for project roadmap planning.
- **Status Update**: Option to add status updates, mark milestones, and sort by date for effective sprint management.

## Usage

- **Add Items**: Use `Control + Space` to quickly add new stories or tasks to any column.
- **Sprint Planning**: Assign tasks to `Next Sprint` or `My Current Sprint` to organize workload for upcoming sprints.
- **Story Management**: Update each story's status by moving them across columns (Todo, In Progress, Done, Canceled).
- **Epic Planning**: Use the Epics tab to map out high-level tasks and align them with project milestones.
## Database Setup

### Schema Creation
- The `schema.sql` file contains the structure of the database.
- To create the database, run the following command:
  ```bash
  mysql -u <username> -p < database/schema.sql
  
### Seeding Initial Data
- The seed_data.sql file contains initial data for the database.
- To populate the database, run:
  ```bash
  mysql -u <username> -p < database/seed_data.sql

### Verify Setup
- Log in to MySQL and check the tables and data:
```bash
mysql -u <username> -p
USE <database_name>;
SHOW TABLES;
SELECT * FROM <table_name>;
```
# Frontend Setup and Usage Guide

This guide explains how to set up and run the frontend code of a React-based web application. Follow the instructions below to get started with the project.

## Prerequisites
Before running the project, ensure the following are installed:
1.	Node.js
○	Download Node.js
2.	Python 
○	Download Python
3.	Flask 
○	Install Flask via pip.
4.	MySQL
○	Download MySQL

Step 1: Clone the Repository
Open a terminal.
Clone the repository using the following command:
```
git clone https://github.com/Ibrahem-Ali99/Scholar-Project.git
```
Navigate to the project directory:
```
cd Scholar-Project
```
# Frontend Setup
1. Navigate to the Client Directory
```
cd client
```
2. Install Dependencies
Run the following command to install all required Node.js packages:
```
npm install
```
3. Start the Frontend
Start the React development server:
```
npm start
```
The frontend will open in your browser at http://localhost:3000. If it doesn’t, manually open the URL in your browser.

# Backend Setup
 1. Navigate to the Server Directory
```
cd server
```

 2. Install Python Dependencies
Install Flask and other required Python packages:
```
pip install -r requirements.txt
```
 3. Set Up the Database
Run the provided script to initialize the database:
```
python init_db.py
```
  Ensure that MySQL is running on your machine and configured properly in the database initialization script.

 4. Start the Backend
Start the Flask server:
```
python app.py
```
The backend server will run at http://localhost:5000.

## Connecting Frontend and Backend
The frontend is pre-configured to communicate with the backend at http://localhost:5000. No additional configuration is needed.

# Project Folder Structure
●	client/: Contains the frontend React code.

●	server/: Contains the backend Flask code, including database setup and API logic.

●	requirements.txt: Lists Python dependencies for the backend.







