# Employee Management System (EMS)
A full-stack CRUD web application built using Angular, Spring Boot, and MySQL that enables HR managers and employees to efficiently manage organizational data.
The project demonstrates role-based access control, pagination, search functionality, and a clear separation between backend APIs and frontend UI.


##  Setup Instructions

1. Clone the repository
git clone https://github.com/yourusername/employee_project.git
cd employee_project

2. Configure the database

Create a new MySQL database named employee_management_system:

CREATE DATABASE employee_management_system;

Update your src/main/resources/application.properties file with your MySQL credentials:

spring.application.name=app-backend
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management_system?useSSL=false
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update

3. Run the backend server
mvn spring-boot:run


The backend will start on
http://localhost:8080

Frontend Setup — Angular
1. Navigate to the Angular project
cd angular-frontend

2. Install dependencies
npm install

3. Start the Angular development server
ng serve


The frontend will start on
http://localhost:4200
