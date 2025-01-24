This project involves building a MERN stack application for managing customer data. The application must handle a dataset of 2 million customer records, provide efficient querying capabilities, and offer a user-friendly frontend with search and filtering functionality.

Instructions

1. Create MongoDB Collection
   Collection Name: Customers

   Fields:
   s_no: Serial number (unique identifier).
   name_of_customer: Full name of the customer.
   email: Email address of the customer.
   mobile_number: Contact number of the customer.
   dob: Date of birth of the customer.
   created_at: Timestamp of record creation.
   modified_at: Timestamp of last modification.

   Indexing:
   Create a compound index on email and mobile_number for better query performance.

2. Generate Fake Data
   Use a library like faker.js to generate 2 million fake customer records.
   Write a Node.js script to bulk-insert the generated records into the MongoDB Customers collection.

3. Backend API
   API Endpoint:
   GET /customers: Fetch paginated data with optional search and filter capabilities.

   Query Parameters:
   page: Current page number (default is 1).
   limit: Number of records per page (default is 10).
   search: Search term for name_of_customer or email.
   filterField & filterValue: For dynamic filtering.

   Features:
   Implement error handling.
   Optimize queries using indexes.

4. Database Indexing
   Create a compound index on email and mobile_number.
   Add additional indexes on frequently queried fields if necessary.

5. Deployment
   Backend Deployment:
   The backend APIs deployed are render platforms.

   Database:
   Use MongoDB Atlas for managing the database.

   Deliverables
   MongoDB Collection:
   Customers collection with 2 million records and applied indexes.

   Backend:
   Fully functional Express.js-based API.

   Project Setup Instructions
   Prerequisites
   Node.js
   Express.js
   MongoDB

   Package managers: npm or yarn
   Steps to Run the Project Locally
   Clone the Repository:

   bash
   Copy
   Edit
   git clone <https://github.com/abhishekchaurasiya/customer-data-backend>
   cd <customer-data-backend>
   Install Dependencies:

   Backend:
   bash
   Copy
   Edit
   cd backend
   npm install

   Set Up Environment Variables:

   Create a .env file in the backend folder with the following:
   env
   Copy
   Edit
   MONGO_URI=<your-mongodb-atlas-uri>
   PORT=4040

   Run the Backend:
   bash
   Copy
   Edit
   cd backend
   npm run dev

   Usage:
   // Basic search with sorting
   GET /customers?search=john&sortField=created_at&sortOrder=desc

   // Date range filter
   GET /customers?startDate=2024-01-01&endDate=2024-01-31

   // Age range filter
   GET /customers?ageRange=25-35

   // Mobile prefix filter
   GET /customers?mobilePrefix=91

   // Combined filters with pagination and sorting
   GET /customers?page=1&limit=20&search=john&sortField=created_at&sortOrder=desc&ageRange=25-35

   Access the Application:
   Backend: http://localhost:5000
