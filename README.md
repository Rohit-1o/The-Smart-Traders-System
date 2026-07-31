# Smart Traders AI

A comprehensive agriculture marketplace platform connecting farmers, traders, vendors, and consumers in India. Features AI-powered agricultural assistance, marketplace functionality, and role-based dashboards.

## Features

- **User Authentication**: Secure registration and login with JWT authentication
- **Role-Based Dashboards**:
  - Farmer Dashboard: Manage crops, view sales
  - Trader Dashboard: Browse crops, manage product requests, track purchases
  - Vendor Dashboard: Manage purchases, transportation
  - Admin Dashboard: Manage users, crops, products, transactions, notifications, audit logs
- **Marketplace**:
  - List and browse crops/products
  - Create purchase requests and product requests
  - Manage transactions and order status
- **AI Agricultural Assistant**: 
  - Chatbot powered by LangChain4j and Ollama
  - Provides farming advice, market guidance, and platform assistance
  - Knowledge base covering crop cultivation, pest control, government schemes, etc.
- **Notifications**: Real-time notifications for platform activities
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Recharts for data visualization
- Axios for HTTP requests
- Context API for state management

### Backend
- Spring Boot 3
- Java 17+
- Spring Security with JWT authentication
- Spring Data JPA with Hibernate
- LangChain4j for AI integration
- Ollama for local LLM inference
- MySQL/PostgreSQL (configurable)
- RESTful API design

### DevOps
- Maven for backend dependency management
- npm/vite for frontend tooling
- Git for version control

## Project Structure

```
smart-traders-ai/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/smarttraders/backend/
│   │   │   │       ├── controller    # REST controllers
        │   │   │   │   ├── service     # Business logic interfaces
        │   │   │   │   ├── service/impl # Service implementations
        │   │   │   │   ├── repository  # Spring Data repositories
        │   │   │   │   ├── entity      # JPA entities
        │   │   │   │   ├── dto         # Data transfer objects
        │   │   │   │   ├── exception   # Custom exceptions
        │   │   │   │   ├── config      # Security and web config
        │   │   │   │   ├── ai          # AI/LangChain components
        │   │   │   │   └── security    # JWT utilities
        │   │   │   └── resources       # Application properties
        │   │   └── test                # Unit tests
        │   └── pom.xml
        ├── mvnw                      # Maven wrapper
        └── HELP.md                   # Build and run instructions
        
├── frontend/                       # React Vite application
│   ├── src/
        │   ├── api                   # Axios API client
        │   ├── assets                # Static images/icons
        │   ├── components            # Shared UI components
        │   ├── context               # React context (Auth, Toast)
        │   ├── features              # Role-specific dashboard pages
        │   ├── pages                 # Individual pages (CropDetail, NotFound)
        │   ├── routes                # Route protection wrappers
        │   ├── utils                 # Helper functions (image URL, constants)
        │   ├── App.jsx               # Main app component
        │   └── main.jsx              # Entry point
        ├── public/                   # Static assets (favicon, icons)
        ├── package.json
        ├── vite.config.js
        ├── .oxlintrc.json            # Oxlint configuration
        └── README.md                 # Frontend-specific instructions
        
└ README.md                         # This file
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.8+
- Node.js 18+ and npm
- Ollama (for AI chat functionality) - [Install Ollama](https://ollama.com/)
- MySQL or PostgreSQL database

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-traders-ai/backend
```

2. Configure the database:
   - Update `src/main/resources/application.properties` with your database credentials
   - Default configuration uses MySQL on localhost:3306

3. Install Ollama and pull the required model:
   ```bash
   # Install Ollama from https://ollama.com/
   ollama pull llama2  # or any other model configured in LangChainConfig.java
   ```

4. Build and run the backend:
```bash
./mvnw clean install
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
   - Edit `src/api/axiosInstance.js` if your backend runs on a different port/host
   - Default is configured to `http://localhost:8080`

4. Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Environment Variables

Create `.env` files in both backend and frontend directories as needed:

**Backend** (`src/main/resources/application.properties`):
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smart_traders
spring.datasource.username=your_username
spring.datasource.password=your_password

# Ollama AI
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.model=llama2

# JWT Security
app.jwt-secret=your_secret_key
app.jwt-expiration-ms=86400000
```

**Frontend** (`.env` in frontend root):
```
VITE_API_URL=http://localhost:8080/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/my-crops` - Get current user's crops
- `GET /api/crops/search` - Search crops by name/price
- `GET /api/crops/{id}` - Get crop by ID
- `POST /api/crops` - Create new crop
- `PUT /api/crops/{id}` - Update crop
- `DELETE /api/crops/{id}` - Delete crop
- `POST /api/crops/{id}/image` - Upload crop image

### Transactions
- `GET /api/transactions/my-purchases` - Get user's purchases
- `GET /api/transactions/my-sales` - Get user's sales
- `POST /api/transactions` - Create transaction
- `PATCH /api/transactions/{id}/status` - Update transaction status

### Chat
- `POST /chat` - Send message to AI assistant
- `GET /chat/history` - Get chat history
- `DELETE /chat/history` - Clear chat history

### Additional endpoints for products, vendors, notifications, etc. are available in the respective controllers.

## Features in Detail

### AI Agricultural Assistant
The chatbot uses LangChain4j with Ollama to provide:
- Farming advice and best practices
- Crop-specific guidance (sowing, irrigation, harvesting)
- Pest and disease identification
- Government scheme information
- Weather-related farming tips
- Market price guidance (with disclaimer about data limitations)

### Role-Based Access Control
- **Farmers**: Can list crops, manage inventory, view sales
- **Traders**: Can browse available crops, create product requests, track purchases
- **Vendors**: Can manage purchases and transportation logistics
- **Admins**: Full system oversight including user management, audit logs, and content moderation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [LangChain4j](https://docs.langchain4j.dev/)
- [Ollama](https://ollama.com/)
- [Recharts](https://recharts.org/)

---
Smart Traders AI - Empowering agriculture through technology   
