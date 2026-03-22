# Secure Patient Records API

A secure REST API for managing patient records with JWT authentication, Role-Based Access Control (RBAC), AES-256 encryption, and HTTPS.

## Features

- **JWT Authentication**: Secure login system
- **RBAC**: Viewer (read-only) and Editor (read + create) roles
- **AES-256 Encryption**: Sensitive data encrypted at rest
- **HTTPS**: Self-signed TLS certificate for secure communication
- **MySQL Database**: Using Sequelize ORM
- **Unit Testing**: Jest tests for API endpoints
- **CI/CD**: Jenkins pipeline for automated deployment

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Security**: JWT, AES-256, HTTPS
- **Testing**: Jest, Supertest
- **CI/CD**: Jenkins

## Project Structure

```
secure-patient-records-api/
├── certs/                 # TLS certificates
├── config/                # Database configuration
├── middleware/            # Authentication and authorization
├── models/                # Sequelize models
├── routes/                # API routes
├── tests/                 # Unit tests
├── utils/                 # Utility functions (encryption)
├── .env.example           # Environment variables template
├── Jenkinsfile            # CI/CD pipeline
├── package.json           # Dependencies and scripts
├── postman_collection.json # Postman collection for testing
├── schema.sql             # Database schema
└── server.js              # Main server file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- OpenSSL (for certificates)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/shahnamajin/secure-health-api.git
cd secure-health-api
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and secrets:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=patient_records
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_byte_encryption_key
PORT=8443
```

### 3. Database Setup

Create the database and tables:

```bash
mysql -u root -p < schema.sql
```

Update the password hashes in `schema.sql` with actual bcrypt hashes for 'password'.

### 4. Generate TLS Certificates

Certificates are already generated in `certs/` directory. If you need to regenerate:

```bash
openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

### 5. Run the Application

```bash
npm start
```

The server will run on `https://localhost:8443`.

## API Endpoints

### Authentication

- `POST /auth/login` - Login and get JWT token

### Patients

- `POST /patients` - Create patient (Editor only)
- `GET /patients` - Get all patients (Viewer and Editor)
- `GET /patients/:id` - Get single patient (Viewer and Editor)

## Testing

### Unit Tests

Run Jest tests:

```bash
npm test
```

### Manual Testing with Postman

1. Import `postman_collection.json` into Postman
2. Login as viewer/editor to get tokens
3. Set tokens in environment variables
4. Test the endpoints

### Testing with curl

Login:

```bash
curl -k -X POST https://localhost:8443/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "editor", "password": "password"}'
```

Create patient (use token from login):

```bash
curl -k -X POST https://localhost:8443/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "John Doe", "age": 30, "diagnosis": "Common cold"}'
```

## RBAC Demonstration

- **Viewer**: Can login, view patients, but cannot create
- **Editor**: Can login, view patients, and create new records

## Security Features

- **Data Encryption**: Patient diagnosis encrypted with AES-256
- **HTTPS**: All communication over TLS
- **JWT Tokens**: Secure authentication
- **Role-Based Access**: Granular permissions

## CI/CD with Jenkins

The `Jenkinsfile` defines a pipeline with stages:

1. Install Dependencies
2. Run Tests
3. Build Project
4. Deploy Locally

## License

MIT