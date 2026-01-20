class User {
  constructor(id, username, email, password, workouts = []) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.workouts = workouts;
  }

  // Transform all relevant data to json (for using in API requests)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      workouts: this.workouts
    };
  }

  // Adds new workout to the user
  addWorkout({ title, date, duration, description, active}) {
    const workoutId = this.workouts.length + 1;

    this.workouts.push({
      id: workoutId,
      title,
      date,
      duration,
      description,
      active,
      exercises: []
    });
  }

  // Adds an exercise to a workout for the user
  addExercise(workoutId, { name, sets, reps, weight }) {
    const workout = this.workouts.find(w => w.id === workoutId);
    if (!workout) return false;

    const exerciseId = workout.exercises.length + 1;

    workout.exercises.push({
      id: exerciseId,
      name,
      sets,
      reps,
      weight
    });

    return true;
  }
}

module.exports = User;
