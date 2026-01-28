# 💪 Node Workout Tracker — A Complete Backend Application

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  A robust workout tracking system built with modern web technologies
</p>

---

#  Project Overview

##  **What is Node Workout Tracker?**
A complete **full-stack web application** designed to help fitness enthusiasts track their workouts, exercises, and progress. Built with security and scalability in mind, it features user authentication, data persistence, and a responsive interface.

##  Screenshots & Interface

###  **Authentication Pages**
<p align="center">
  <img width="80%" alt="Login Page" src="https://github.com/user-attachments/assets/e1adf6e5-55da-4820-a163-7eaba0adb7d2" />
  <br><em>Secure Login Interface</em>
</p>

<p align="center">
  <img width="1204" height="931" alt="Register Page" src="https://github.com/user-attachments/assets/167dee7d-e176-492d-a203-15bd151362ca" />
<br><br>
  <br><em>User Registration Form</em>
</p>

<p align="center">
  <img width="30%" alt="Mobile Login" src="https://github.com/user-attachments/assets/a4e1f80b-c360-41cc-a141-8a77b3eb6dd5" />
  <br><em>Mobile Responsive Design</em>
</p>

### 🏠 **Dashboard & Workout Management**
<p align="center">
  <img width="80%" alt="Home Dashboard" src="https://github.com/user-attachments/assets/b8bb2386-217d-4184-92df-0b0a0a9f0326" />
  <br><em>Clean Dashboard Interface</em>
</p>

<p align="center">
  <img width="30%" alt="Mobile Dashboard" src="https://github.com/user-attachments/assets/b3731727-463e-47fa-be51-ffddf4083f49" />
  <br><em>Mobile Dashboard View</em>
</p>

### 📝 **Workout Creation & Editing**
<p align="center">
  <img width="60%" alt="Create Workout Modal" src="https://github.com/user-attachments/assets/fd1c1f3a-4a61-459f-a8c4-73333457ef84" />
  <br><em>Interactive Workout Creation Modal</em>
</p>

<p align="center">
  <img width="80%" alt="Workout List" src="https://github.com/user-attachments/assets/929c9273-6a82-4218-8948-eb5c6630e081" />
  <br><em>Complete Workout Listing</em>
</p>

---

# Technology Stack

### **Backend**
<p>
  <img src="https://img.shields.io/badge/Node.js-18.x+-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.x-lightgrey?logo=express" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-15.x-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JSON%20Web%20Tokens-Auth-purple" alt="JWT">
  <img src="https://img.shields.io/badge/bcrypt-Password%20Hashing-yellow" alt="bcrypt">
</p>

### **Frontend**
<p>
  <img src="https://img.shields.io/badge/HTML5-Semantic%20Markup-orange?logo=html5" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Flexbox%2FGrid-blue?logo=css3" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/Fetch%20API-Async%2FAwait-lightblue" alt="Fetch API">
</p>

### **Development Tools**
<p>
  <img src="https://img.shields.io/badge/npm-Package%20Manager-red?logo=npm" alt="npm">
  <img src="https://img.shields.io/badge/Git-Version%20Control-orange?logo=git" alt="Git">
  <img src="https://img.shields.io/badge/RESTful%20API-Architecture-green" alt="REST API">
</p>

---

# Setup

OBS: Node.js and PostgreSQL are required to be in the machine to run this project
```
// IDE
npm install
cd src
node server.js
# Edit enviroment variables (DB password, server port) with your own values
```

```
// SQL Query for setting up the database in your machine
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    duration INTEGER,
    date DATE,
    status VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    ex_sets INT NOT NULL,
    reps INT NOT NULL,
    weight NUMERIC(6,2) NOT NULL

    CONSTRAINT fk_workout
        FOREIGN KEY (workout_id)
        REFERENCES workouts(id)
        ON DELETE CASCADE
);


```
