# FitTracker - Diet & Exercise Tracker

A comprehensive full-stack web application for tracking diet, exercise, and fitness progress with Indian nutrition data and intelligent recommendations.

## Features

### 🔐 Authentication & Profile
- User registration and login system
- Comprehensive profile setup (age, height, weight, gender, fitness goals)
- Diet preference selection (vegetarian, non-vegetarian, vegan, eggetarian)

### 🍽️ Meal Tracking
- Extensive Indian food database with accurate calorie information
- Easy meal logging with search functionality
- Calorie intake vs goal tracking
- Meal history and breakdown visualization

### 🏃‍♂️ Workout Tracking
- Wide variety of exercise types with calorie burn estimation
- Duration and intensity tracking
- Weekly workout progress monitoring
- Personalized calorie burn calculations

### 📊 Progress Monitoring
- Weight and body measurements tracking
- Interactive charts for weight progress over time
- Progress photo uploads with preview
- Comprehensive dashboard with key metrics

### 🧠 Smart Features
- Intelligent meal suggestions based on profile and goals
- Workout recommendations tailored to fitness objectives
- Reminder system for meals and exercise (UI ready)
- Coming soon: AI meal plans and social features

### 🎨 Modern UI/UX
- Clean, Apple Health/Notion-inspired design
- Soft color schemes with rounded cards
- Fully responsive mobile design
- Elegant typography and smooth animations

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **shadcn/ui** components
- **Next.js** App Router

### Backend
- **Flask** (Python) REST API
- **SQLite** database
- **Session-based authentication**
- **CORS** enabled for frontend integration

### Database Schema
- Users, meals, workouts, weight_logs, progress_photos tables
- Comprehensive Indian food database
- Workout types with calorie burn rates
- Optimized with proper indexing

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- pip (Python package manager)

### Frontend Setup
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Backend Setup
\`\`\`bash
# Install Python dependencies
pip install flask flask-cors

# Run the Flask server
python scripts/flask_backend.py
\`\`\`

### Database Setup
The SQLite database will be automatically created when you first run the Flask backend. The schema includes:

- User profiles and authentication
- Meal logging with Indian food data
- Workout tracking with calorie calculations
- Weight and measurement history
- Progress photo storage

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Meal Tracking
- `POST /api/meals` - Log a meal
- `GET /api/meals` - Get meal history
- `GET /api/foods` - Get food database

### Workout Tracking
- `POST /api/workouts` - Log a workout
- `GET /api/workouts` - Get workout history

### Progress Tracking
- `POST /api/weight` - Log weight/measurements
- `GET /api/weight` - Get weight history
- `GET /api/dashboard` - Get dashboard data

## Features in Detail

### Indian Nutrition Database
- 20+ common Indian foods with accurate calorie data
- Vegetarian/non-vegetarian categorization
- Protein, carbs, fat, and fiber information
- Serving size specifications

### Intelligent Recommendations
- Meal suggestions based on diet preferences and goals
- Workout recommendations for different fitness objectives
- Calorie deficit/surplus calculations for weight goals

### Progress Visualization
- Interactive weight progress charts
- Calorie intake vs goal tracking
- Weekly workout frequency monitoring
- Body measurement trends

### Mobile Responsive Design
- Optimized for all screen sizes
- Touch-friendly interface
- Progressive Web App ready
- Offline capability (coming soon)

## Deployment

### Replit Deployment
1. Import the project to Replit
2. Install dependencies: `npm install`
3. Set up Python environment: `pip install flask flask-cors`
4. Configure run command: `npm run dev` (frontend) and `python scripts/flask_backend.py` (backend)
5. Set up port forwarding for both frontend (3000) and backend (5000)

### Environment Variables
\`\`\`env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///fittracker.db
\`\`\`

## Future Enhancements

### Coming Soon Features
- **AI Meal Planning**: Personalized weekly meal plans
- **Social Features**: Connect with friends and share progress
- **Advanced Analytics**: Detailed nutrition and fitness insights
- **Wearable Integration**: Sync with fitness trackers
- **Offline Mode**: Work without internet connection

### Planned Improvements
- Push notifications for reminders
- Barcode scanning for food items
- Recipe suggestions and meal prep
- Trainer/nutritionist consultation booking
- Community challenges and leaderboards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@fittracker.com or create an issue in the GitHub repository.

---

**FitTracker** - Your journey to better health starts here! 🌟
