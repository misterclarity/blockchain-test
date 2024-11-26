# Community Mental Health Blockchain Platform

A decentralized platform for sharing and discovering mental health resources, built on blockchain technology for transparency and trust.

## Features

- **Resource Submission**: Add mental health resources with detailed information
- **Blockchain Explorer**: View the entire chain of resources and their verification
- **Resource Directory**: Browse and filter resources by type
- **Proof-of-Work**: Secure blockchain with mining difficulty of 2
- **Persistent Storage**: All data is stored in SQLite database

## Resource Types

- Therapy Services
- Support Groups
- Crisis Support
- Educational Resources
- Wellness Programs

## Technical Stack

- **Backend**: Node.js with Fastify
- **Database**: SQLite
- **Frontend**: Vanilla JavaScript
- **Blockchain**: Custom implementation with CryptoJS
- **Security**: Content Security Policy enabled

## API Endpoints

- `GET /`: Main application interface
- `GET /api/blocks`: Retrieve all blockchain blocks
- `POST /api/blocks`: Add new block to the chain
- `GET /api/resources`: Get resources (filterable by type)
- `POST /api/reset`: Clear all blockchain data (for testing)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Visit `http://localhost:3000` in your browser

## Development

The application uses:
- Fastify for efficient routing
- SQLite for persistent storage
- CryptoJS for blockchain hashing
- Custom proof-of-work implementation

## Security

- Content Security Policy implemented
- Data validation on both client and server
- Secure block mining with adjustable difficulty
- SQLite database for reliable storage

## Database Schema

### Blocks Table
- id (PRIMARY KEY)
- timestamp
- data
- previousHash
- hash
- nonce

### Resources Table
- id (PRIMARY KEY)
- type
- name
- description
- contact
- blockId (FOREIGN KEY)

## Contributing

Feel free to submit issues and enhancement requests!
