-- Drop all dependent tables first (respecting FK constraints)
DROP TABLE IF EXISTS
    user_goals,
    workout_types,
    workouts,
    meals,
    weight_logs,
    reminders,
    progress_photos,
    foods,
    users
CASCADE;