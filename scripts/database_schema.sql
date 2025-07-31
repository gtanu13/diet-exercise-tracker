-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_goals, workout_types, workouts, meals, weight_logs, reminders, progress_photos, foods, users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods table
CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    calories_per_100g INTEGER NOT NULL,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER
);

-- Meals table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id),
    quantity_in_grams INTEGER NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Types table
CREATE TABLE workout_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    calories_per_minute INTEGER
);

-- Workouts table
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workout_type_id INTEGER REFERENCES workout_types(id),
    duration_minutes INTEGER NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weight Logs
CREATE TABLE weight_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress Photos
CREATE TABLE progress_photos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reminders
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    remind_at TIMESTAMP
);

-- User Goals
CREATE TABLE user_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL, -- e.g., "weight", "protein intake"
    target_value DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, DATE(logged_at));
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, DATE(logged_at));
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, DATE(logged_at));
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Seed data: Foods
INSERT INTO foods (name, calories_per_100g, protein, carbs, fat) VALUES
('Boiled Egg', 155, 13, 1, 11),
('Grilled Chicken Breast', 165, 31, 0, 3),
('White Rice', 130, 2, 28, 0),
('Banana', 89, 1, 23, 0),
('Paneer', 265, 18, 1, 20);

-- Seed data: Workout Types
INSERT INTO workout_types (name, category, calories_per_minute) VALUES
('Running', 'Cardio', 10),
('Cycling', 'Cardio', 8),
('Push-ups', 'Strength', 7),
('Yoga', 'Flexibility', 4),
('Weightlifting', 'Strength', 6);