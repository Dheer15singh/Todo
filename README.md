# Todo App


# 🚀 Overview

A simple Todo App built using HTML, CSS, JavaScript for the frontend and Node.js, Express, MySQL for the backend. This app allows users to add, update, reorder, and delete tasks with real-time database integration.


# 🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MySQL


# 📌 Features

✅ Create new tasks.

✅ Mark tasks as completed (shown in the Completed tab with a line-through and checked box).

✅ Active tasks remain in the Active tab.

✅ View all tasks in the All tab.

✅ Change task order based on priority after creation

✅ Edit task name after creating it

✅ Delete tasks if completed or created by mistake


# 🔧 Installation & Setup

Follow these steps to set up and run the project locally:


# 1️⃣ Clone the Repository

git clone https://github.com/Dheer15singh/Todo.git

cd todo-app


# 2️⃣ Install Dependencies

# Backend:

1. cd backend

2. npm install

# Frontend:

No extra dependencies needed for the frontend.


# 3️⃣ Setup MySQL Database

To set up the database, follow these steps:

1. Install MySQL if not installed.

2. Create a new MySQL database by running the following command:

   CREATE DATABASE database_name;
   
   USE database_name;

3. Create the tasks table by running:
   
   CREATE TABLE table_name (
   
      id INT NOT NULL AUTO_INCREMENT,
   
      taskName VARCHAR(255) NOT NULL,
   
      taskStatus ENUM('active', 'completed') NOT NULL DEFAULT 'active',
   
      taskOrder INT DEFAULT NULL,
   
      PRIMARY KEY (id)

  );

4. Update database credentials in backend/db.js with your MySQL connection details.
   

# 4️⃣ Run the Project

Start Backend Server:

cd backend

node index.js


# 📷 Screenshots

![Todo tasks](https://github.com/user-attachments/assets/ab5e908c-7696-4476-9ef0-f052216ab2d8)


![Todo active](https://github.com/user-attachments/assets/6b0974eb-5d63-4eaf-a54b-224af318a5af)


![Todo complete](https://github.com/user-attachments/assets/8f091340-0743-40d1-a1b9-4c3f1e31ea70)


# 🤝 Contributing

Feel free to contribute! Fork the repo, make your changes, and create a pull request.


# 📜 License

This project is open-source and available under the MIT License.
