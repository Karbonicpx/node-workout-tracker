class User {
  constructor(id, username, email, password, workouts = []) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.workouts = workouts;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      workouts: this.workouts
    };
  }

  // Adds new workout
  addWorkout(workoutData) {
    const workoutId = this.workouts.length > 0 
      ? Math.max(...this.workouts.map(w => w.id)) + 1 
      : 1;
    
    const newWorkout = {
      id: workoutId,
      title: workoutData.title,
      type: workoutData.type,
      duration: workoutData.duration,
      date: workoutData.date,
      status: workoutData.status,
      description: workoutData.description || '',
      exercises: workoutData.exercises || []
    };
    
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  // Find workout by id
  findWorkoutById(workoutId) {
    return this.workouts.find(w => w.id === workoutId);
  }

  // Updates workout
  updateWorkout(workoutId, workoutData) {
    const workout = this.findWorkoutById(workoutId);
    if (!workout) return null;
    
    // Update only with the data provided
    Object.keys(workoutData).forEach(key => {
      if (workoutData[key] !== undefined) {
        workout[key] = workoutData[key];
      }
    });
    
    return workout;
  }

  // Remove workout
  removeWorkout(workoutId) {
    const index = this.workouts.findIndex(w => w.id === workoutId);
    if (index === -1) return false;
    
    this.workouts.splice(index, 1);
    return true;
  }
}

module.exports = User;