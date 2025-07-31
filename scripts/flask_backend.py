from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import datetime
import hashlib
import datetime
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import traceback

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production
CORS(app)

# Database configuration
DB_CONFIG = {
    'dbname': 'diet_tracker',
    'user': 'tanu',
    'host': 'localhost',
    'port': '5432'
}

# Helper function to get PostgreSQL connection
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None

# Database setup for PostgreSQL
def init_db():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database!")
        return
    
    try:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                age INTEGER,
                height REAL,
                weight REAL,
                gender VARCHAR(50),
                fitness_goal TEXT,
                diet_preference TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Meals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS meals (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                meal_type VARCHAR(100) NOT NULL,
                foods JSONB NOT NULL,
                total_calories INTEGER,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Workouts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS workouts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                workout_type VARCHAR(255) NOT NULL,
                duration_minutes INTEGER NOT NULL,
                intensity VARCHAR(50),
                calories_burned INTEGER,
                notes TEXT,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Weight logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weight_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                weight REAL NOT NULL,
                waist REAL,
                chest REAL,
                hips REAL,
                arms REAL,
                thighs REAL,
                notes TEXT,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Progress photos table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS progress_photos (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                photo_data TEXT NOT NULL,
                description TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        print("Database tables created successfully!")
        
    except psycopg2.Error as e:
        print(f"Database setup error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Helper functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Authentication routes
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if user already exists
        cursor.execute('SELECT id FROM users WHERE email = %s', (data['email'],))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        password_hash = hash_password(data['password'])
        
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, age, height, weight, 
                              gender, fitness_goal, diet_preference)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        ''', (
            data['name'], data['email'], password_hash,
            data.get('age'), data.get('height'), data.get('weight'),
            data.get('gender'), data.get('fitnessGoal'), data.get('dietPreference')
        ))
        
        user_id = cursor.fetchone()['id']
        conn.commit()
        cursor.close()
        conn.close()
        
        session['user_id'] = user_id
        
        print(f"User created successfully with ID: {user_id}")  # Debug log
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        print(f"Signup error: {e}")
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT * FROM users WHERE email = %s', (data['email'],))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user or user['password_hash'] != hash_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        session['user_id'] = user['id']
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'age': user['age'],
                'height': user['height'],
                'weight': user['weight'],
                'gender': user['gender'],
                'fitness_goal': user['fitness_goal'],
                'diet_preference': user['diet_preference']
            }
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

# Meal logging routes
@app.route('/api/meals', methods=['POST'])
def log_meal():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        user_id = session['user_id']
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO meals (user_id, meal_type, foods, total_calories)
            VALUES (%s, %s, %s, %s)
        ''', (
            user_id, data['mealType'], json.dumps(data['foods']), data['totalCalories']
        ))
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"Meal logged for user {user_id}")  # Debug log
        
        return jsonify({'message': 'Meal logged successfully'})
        
    except Exception as e:
        print(f"Log meal error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/meals', methods=['GET'])
def get_meals():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session['user_id']
        date = request.args.get('date', datetime.date.today().isoformat())
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('''
            SELECT * FROM meals 
            WHERE user_id = %s AND DATE(logged_at) = %s
            ORDER BY logged_at DESC
        ''', (user_id, date))
        meals = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify([dict(meal) for meal in meals])
        
    except Exception as e:
        print(f"Get meals error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Workout logging routes
@app.route('/api/workouts', methods=['POST'])
def log_workout():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        user_id = session['user_id']
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO workouts (user_id, workout_type, duration_minutes, intensity, 
                                 calories_burned, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            user_id, data['workout'], data['duration'], data['intensity'],
            data['caloriesBurned'], data.get('notes', '')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"Workout logged for user {user_id}: {data['workout']}")  # Debug log
        
        return jsonify({'message': 'Workout logged successfully'})
        
    except Exception as e:
        print(f"Log workout error: {e}")
        print(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/workouts', methods=['GET'])
def get_workouts():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session['user_id']
        limit = request.args.get('limit', 10)
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('''
            SELECT * FROM workouts 
            WHERE user_id = %s
            ORDER BY logged_at DESC
            LIMIT %s
        ''', (user_id, limit))
        workouts = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify([dict(workout) for workout in workouts])
        
    except Exception as e:
        print(f"Get workouts error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Weight logging routes
@app.route('/api/weight', methods=['POST'])
def log_weight():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        user_id = session['user_id']
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO weight_logs (user_id, weight, waist, chest, hips, arms, thighs, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            user_id, data['weight'], data.get('waist'), data.get('chest'),
            data.get('hips'), data.get('arms'), data.get('thighs'), data.get('notes', '')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"Weight logged for user {user_id}")  # Debug log
        
        return jsonify({'message': 'Weight logged successfully'})
        
    except Exception as e:
        print(f"Log weight error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/weight', methods=['GET'])
def get_weight_history():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session['user_id']
        limit = request.args.get('limit', 30)
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('''
            SELECT * FROM weight_logs 
            WHERE user_id = %s
            ORDER BY logged_at DESC
            LIMIT %s
        ''', (user_id, limit))
        weights = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify([dict(weight) for weight in weights])
        
    except Exception as e:
        print(f"Get weight history error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Dashboard data route
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        user_id = session['user_id']
        today = datetime.date.today().isoformat()
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get today's calories
        cursor.execute('''
            SELECT SUM(total_calories) as total_calories
            FROM meals 
            WHERE user_id = %s AND DATE(logged_at) = %s
        ''', (user_id, today))
        today_meals = cursor.fetchone()
        
        # Get this week's workouts
        week_start = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
        cursor.execute('''
            SELECT COUNT(*) as workout_count
            FROM workouts 
            WHERE user_id = %s AND DATE(logged_at) >= %s
        ''', (user_id, week_start))
        week_workouts = cursor.fetchone()
        
        # Get latest weight
        cursor.execute('''
            SELECT weight FROM weight_logs 
            WHERE user_id = %s
            ORDER BY logged_at DESC
            LIMIT 1
        ''', (user_id,))
        latest_weight = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'calories_today': today_meals['total_calories'] or 0,
            'workouts_this_week': week_workouts['workout_count'] or 0,
            'current_weight': latest_weight['weight'] if latest_weight else None
        })
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Food database route (mock Indian foods)
@app.route('/api/foods', methods=['GET'])
def get_foods():
    indian_foods = [
        {'name': 'Roti (Wheat)', 'calories': 104, 'category': 'Grains', 'veg': True},
        {'name': 'Rice (Cooked)', 'calories': 130, 'category': 'Grains', 'veg': True},
        {'name': 'Dal (Moong)', 'calories': 118, 'category': 'Pulses', 'veg': True},
        {'name': 'Dal (Toor)', 'calories': 115, 'category': 'Pulses', 'veg': True},
        {'name': 'Rajma', 'calories': 127, 'category': 'Pulses', 'veg': True},
        {'name': 'Chole', 'calories': 164, 'category': 'Pulses', 'veg': True},
        {'name': 'Paneer', 'calories': 265, 'category': 'Dairy', 'veg': True},
        {'name': 'Chicken Curry', 'calories': 180, 'category': 'Non-Veg', 'veg': False},
        {'name': 'Fish Curry', 'calories': 150, 'category': 'Non-Veg', 'veg': False},
        {'name': 'Egg Curry', 'calories': 155, 'category': 'Non-Veg', 'veg': False},
        {'name': 'Aloo Sabzi', 'calories': 85, 'category': 'Vegetables', 'veg': True},
        {'name': 'Bhindi Sabzi', 'calories': 35, 'category': 'Vegetables', 'veg': True},
        {'name': 'Palak Sabzi', 'calories': 23, 'category': 'Vegetables', 'veg': True},
        {'name': 'Mixed Vegetables', 'calories': 55, 'category': 'Vegetables', 'veg': True},
        {'name': 'Idli (2 pieces)', 'calories': 58, 'category': 'South Indian', 'veg': True},
        {'name': 'Dosa (Plain)', 'calories': 168, 'category': 'South Indian', 'veg': True},
        {'name': 'Upma', 'calories': 85, 'category': 'South Indian', 'veg': True},
        {'name': 'Poha', 'calories': 76, 'category': 'Breakfast', 'veg': True},
        {'name': 'Paratha (Plain)', 'calories': 126, 'category': 'Grains', 'veg': True},
        {'name': 'Biryani (Veg)', 'calories': 290, 'category': 'Rice', 'veg': True},
        {'name': 'Biryani (Chicken)', 'calories': 350, 'category': 'Rice', 'veg': False},
    ]
    
    search = request.args.get('search', '').lower()
    if search:
        indian_foods = [food for food in indian_foods if search in food['name'].lower()]
    
    return jsonify(indian_foods)

# Test database connection endpoint
@app.route('/api/test-db', methods=['GET'])

def test_db():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM users')
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        
        return jsonify({
            'message': 'Database connection successful',
            'user_count': count
        })
        
    except Exception as e:
        print(f"Database test error: {e}")
        return jsonify({'error': f'Database test failed: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def health_check():
    return "Flask backend is running!"

if __name__ == '__main__':
    print("Initializing database...")
    init_db()
    print("Starting Flask app...")
    app.run(debug=True, host='0.0.0.0', port=5001)