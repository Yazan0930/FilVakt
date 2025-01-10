# Digital Document Management System for Karlskrona Kommun's Home Care Department  

## Description  
This project involves the development of a digital document management system for the home care department of Karlskrona Kommun. The system aims to eliminate the risk of staff missing important documents, even after periods of absence. It includes a Kanban board to manage tasks, track document statuses, and ensure everyone stays updated with the latest information. By digitizing document management, the project reduces paper usage and promotes an eco-friendly and efficient work environment.  

## Key Benefits  
- **Improved Document Overview and Accessibility**: Easily find and manage important documents.  
- **Reduced Risk of Missed Tasks or Lost Documents**: Ensures staff always have access to up-to-date information.  
- **Ease of Access for Returning Staff**: Seamless access to unread and pending documents.  
- **Eco-Friendly Workplace**: Less paper usage contributes to sustainability.  
- **Streamlined Workflow**: Track document statuses clearly via the Kanban board.  

## Goals  
1. **Efficiency**: Simplify finding, sorting, and managing documents like PDFs.  
2. **User-Friendliness**: Ensure the system is easy to use for planners, nurses, and administrators.  
3. **Accessibility**: Provide access to documents on both computers and mobile devices, considering ergonomics and practical needs.  
4. **Security**: Handle sensitive information securely and comply with GDPR requirements.  
5. **Flexibility**: Enable functionalities like marking documents as read, incoming, or "to-do."  

---

## Project Structure  
The project is divided into two main directories:  
1. **`client`**: Contains the frontend application.  
2. **`server`**: Contains the backend server and database logic.  

---

## Setup Instructions  

### Start the Client  
1. Navigate to the client directory:  
   ```bash
   cd client
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
### Start the Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Start your MySQL server and load the schema:
   ```bash
   mysql -u root -p < schema.sql
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Application URL
Once both the client and server are running, you can access the application at:
[http://localhost:5173](http://localhost:5173)

### Technologies Used
- **Frontend**: Vite, React, TypeScript, NextUI
- **Backend**: Node.js, Express
- **Database**: MySQL
