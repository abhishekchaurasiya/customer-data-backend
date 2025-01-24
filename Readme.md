# Customer Data Management System

## Project Overview

A full-stack MERN application designed to manage and efficiently query a large-scale customer database with 2 million records.

## Key Features

- **Data Generation**: Bulk generation of 2 million customer records
- **Backend API**: Advanced querying with pagination, search, and filtering
- **Performance Optimized**: Indexed MongoDB collection, Redis caching

## Technology Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Caching**: Redis
- **Data Generation**: Faker.js

## Project Structure

```
customer-data-management/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env
│   └── .gitignore
│
└── README.md
```

## Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Redis server
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/abhishekchaurasiya/customer-data-backend
cd customer-data-backend
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

## Configuration

Create `.env` files in `backend`:

### Backend `.env`

```
MONGO_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
PORT=4040
```

## Data Generation

Generate 2 million customer records:

```bash
cd backend
npm run generate-data
```

## Running the Application

1. Start Backend:

```bash
cd backend
npm run dev
```

## API Endpoints

### GET /customers

Retrieve paginated customer data with advanced filtering:

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10)
- `search`: Search across name, email
- `filterField`: Field to filter
- `filterValue`: Value to filter

**Example Queries**:

- Basic search: `/customers?search=john`
- Filtered search: `/customers?filterField=mobile_number&filterValue=91`

## Performance Optimization

- MongoDB compound indexing
- Redis caching
- Efficient query pagination
- Compressed API responses

## Deployment

- **Backend**: Render
- **Database**: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.

## Contact

Your Name - youremail@example.com

Project Link: [https://github.com/yourusername/customer-data-management](https://github.com/abhishekchaurasiya/customer-data-backend)

```

## Future Roadmap

- Add authentication
- Implement data export functionality
- Create advanced analytics dashboard
- Enhance real-time filtering capabilities
```

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Faker.js](https://fakerjs.dev/)

Access the Application:
Backend: [https://customer-data-backend-3ifx.onrender.com/api/customers]
