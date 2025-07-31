from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import hashlib
import datetime
import json
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('fittracker.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            age INTEGER,
            height REAL,
            weight REAL,
            gender TEXT,
            fitness_goal TEXT,
            diet_preference TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Meals table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            meal_type TEXT NOT NULL,
            foods JSON NOT NULL,
            total_calories INTEGER,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Workouts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            workout_type TEXT NOT NULL,
            duration INTEGER NOT NULL,
            intensity TEXT,
            calories_burned INTEGER,
            notes TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Weight logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weight_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            weight REAL NOT NULL,
            waist REAL,
            chest REAL,
            hips REAL,
            arms REAL,
            thighs REAL,
            notes TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Progress photos table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS progress_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            photo_data TEXT NOT NULL,
            description TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Helper functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_db_connection():
    conn = sqlite3.connect('fittracker.db')
    conn.row_factory = sqlite3.Row
    return conn

# Authentication routes
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    
    # Validate required fields
    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    conn = get_db_connection()
    
    # Check if user already exists
    existing_user = conn.execute(
        'SELECT id FROM users WHERE email = ?', (data['email'],)
    ).fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({'error': 'User already exists'}), 400
    
    # Create new user
    password_hash = hash_password(data['password'])
    
    cursor = conn.execute('''
        INSERT INTO users (name, email, password_hash, age, height, weight, 
                          gender, fitness_goal, diet_preference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'], data['email'], password_hash,
        data.get('age'), data.get('height'), data.get('weight'),
        data.get('gender'), data.get('fitnessGoal'), data.get('dietPreference')
    ))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    session['user_id'] = user_id
    
    return jsonify({
        'message': 'User created successfully',
        'user_id': user_id
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE email = ?', (data['email'],)
    ).fetchone()
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

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})

# Meal logging routes
@app.route('/api/meals', methods=['POST'])
def log_meal():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    user_id = session['user_id']
    
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO meals (user_id, meal_type, foods, total_calories)
        VALUES (?, ?, ?, ?)
    ''', (
        user_id, data['mealType'], json.dumps(data['foods']), data['totalCalories']
    ))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Meal logged successfully'})

@app.route('/api/meals', methods=['GET'])
def get_meals():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    date = request.args.get('date', datetime.date.today().isoformat())
    
    conn = get_db_connection()
    meals = conn.execute('''
        SELECT * FROM meals 
        WHERE user_id = ? AND DATE(logged_at) = ?
        ORDER BY logged_at DESC
    ''', (user_id, date)).fetchall()
    conn.close()
    
    return jsonify([dict(meal) for meal in meals])

# Workout logging routes
@app.route('/api/workouts', methods=['POST'])
def log_workout():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    user_id = session['user_id']
    
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO workouts (user_id, workout_type, duration, intensity, 
                             calories_burned, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        user_id, data['workout'], data['duration'], data['intensity'],
        data['caloriesBurned'], data.get('notes', '')
    ))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Workout logged successfully'})

@app.route('/api/workouts', methods=['GET'])
def get_workouts():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    limit = request.args.get('limit', 10)
    
    conn = get_db_connection()
    workouts = conn.execute('''
        SELECT * FROM workouts 
        WHERE user_id = ?
        ORDER BY logged_at DESC
        LIMIT ?
    ''', (user_id, limit)).fetchall()
    conn.close()
    
    return jsonify([dict(workout) for workout in workouts])

# Weight logging routes
@app.route('/api/weight', methods=['POST'])
def log_weight():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.json
    user_id = session['user_id']
    
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO weight_logs (user_id, weight, waist, chest, hips, arms, thighs, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id, data['weight'], data.get('waist'), data.get('chest'),
        data.get('hips'), data.get('arms'), data.get('thighs'), data.get('notes', '')
    ))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Weight logged successfully'})

@app.route('/api/weight', methods=['GET'])
def get_weight_history():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    limit = request.args.get('limit', 30)
    
    conn = get_db_connection()
    weights = conn.execute('''
        SELECT * FROM weight_logs 
        WHERE user_id = ?
        ORDER BY logged_at DESC
        LIMIT ?
    ''', (user_id, limit)).fetchall()
    conn.close()
    
    return jsonify([dict(weight) for weight in weights])

# Dashboard data route
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session['user_id']
    today = datetime.date.today().isoformat()
    
    conn = get_db_connection()
    
    # Get today's calories
    today_meals = conn.execute('''
        SELECT SUM(total_calories) as total_calories
        FROM meals 
        WHERE user_id = ? AND DATE(logged_at) = ?
    ''', (user_id, today)).fetchone()
    
    # Get this week's workouts
    week_start = (datetime.date.today() - datetime.timedelta(days=7)).isoformat()
    week_workouts = conn.execute('''
        SELECT COUNT(*) as workout_count
        FROM workouts 
        WHERE user_id = ? AND DATE(logged_at) >= ?
    ''', (user_id, week_start)).fetchone()
    
    # Get latest weight
    latest_weight = conn.execute('''
        SELECT weight FROM weight_logs 
        WHERE user_id = ?
        ORDER BY logged_at DESC
        LIMIT 1
    ''', (user_id,)).fetchone()
    
    conn.close()
    
    return jsonify({
        'calories_today': today_meals['total_calories'] or 0,
        'workouts_this_week': week_workouts['workout_count'] or 0,
        'current_weight': latest_weight['weight'] if latest_weight else None
    })

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

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
