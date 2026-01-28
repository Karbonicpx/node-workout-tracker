const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const pool = require('../data/db');

const router = express.Router();

// Get authenticated user data
router.get('/me', authenticateToken, async (req, res) => {

    try {
        // Finding all useful data from the user
        const result = await pool.query(
            `
            SELECT id, username, email, created_at 
            FROM users 
            WHERE id = $1;
            `,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Returning the user
        return res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

// Get all workouts of authenticated user
router.get('/me/workouts', authenticateToken, async (req, res) => {
    try {
        // This query will find all relevant information from all the workouts that has the same user_id as the user id
        const result = await pool.query(
            `
            SELECT 
                id,
                title,
                type,
                duration,
                date,
                status,
                description,
                created_at
            FROM workouts
            WHERE user_id = $1
            ORDER BY date DESC;
            `,
            [req.user.id]
        );

        // Returning all the workouts
       return res.status(200).json(result.rows);
    }
    catch (error){
        console.error('Error fetching workouts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Add workout to authenticated user
router.post('/me/workouts', authenticateToken, async (req, res) => {

    const { title, type, duration, date, status, description } = req.body;
    try {

        // Inserting new workout to the database
        const result = await pool.query(
            `INSERT INTO workouts (user_id, title, type, duration, date, status, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, user_id, title, type, duration, date, status, description;`,
            [req.user.id, title, type, duration, date, status, description]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Updating workout
router.put('/me/workouts/:workoutId', authenticateToken, async (req, res) => {


    const { title, type, duration, date, status, description } = req.body;
    try {

        // Updating workout in the database, based on the workout we want to change (workoutId) and if the user id is the same as user_id
        const result = await pool.query(
            `UPDATE workouts
             SET
                title = $1,
                type = $2,
                duration = $3,
                date = $4,
                status = $5,
                description = $6
             WHERE id = $7
             AND user_id = $8
             RETURNING
                id,
                user_id,
                title,
                type,
                duration,
                date,
                status,
                description;`,
            [title, type, duration, date, status, description, req.params.workoutId, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Workout not found or does not belong to user'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

});

// Delete workout
router.delete('/me/workouts/:workoutId', authenticateToken,  async (req, res) => {

    try {

        // Updating workout in the database, based on the workout we want to change (workoutId) and if the user id is the same as user_id
        const result = await pool.query(
            `DELETE FROM workouts
             WHERE id = $1
             AND user_id = $2
             RETURNING id, user_id;`,
            [req.params.workoutId, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Workout not found or does not belong to user'
            });
        }

        res.status(204).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Getting exercises from the workout
router.get('/me/workouts/:workoutId/exercises', authenticateToken, async (req, res) => {

    try {
        const result = await pool.query(
            `
            SELECT 
                id,
                name,
                ex_sets,
                reps,
                weight
            FROM exercises
            WHERE workout_id = $1;
            `,
            [req.params.workoutId]
        );

        // Returning all of the exercises
        return res.status(200).json(result.rows);
    }
    catch (error){
        console.error('Error fetching exercises:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Adding exercises to the workout
router.post('/me/workouts/:workoutId/exercises', authenticateToken, async (req, res) => {

    const { name, ex_sets, reps, weight } = req.body;
    try {

        // Inserting new exercise associated to a workout in the database
        const result = await pool.query(
            `INSERT INTO exercises (workout_id, name, ex_sets, reps, weight)
             SELECT id, $2, $3, $4, $5
             FROM workouts
             WHERE id = $1
             RETURNING workout_id, name, ex_sets, reps, weight;
            `,
            [req.params.workoutId, name, ex_sets, reps, weight]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Workout not found'
            });
        }

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Updating exercise
router.put('/me/workouts/:workoutId/exercises/:exerciseId', authenticateToken, async (req, res) => {


    const { name, ex_sets, reps, weight } = req.body;
    try {

        // Updating exercise in the database
        const result = await pool.query(
            `UPDATE exercises
             SET
                name = $1,
                ex_sets = $2,
                reps = $3,
                weight = $4
             WHERE id = $5
             AND workout_id = $6
             RETURNING *;`,
            [name, ex_sets, reps, weight, req.params.exerciseId, req.params.workoutId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Exercise not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

});

// Deleting exercises in a workout
router.delete('/me/workouts/:workoutId/exercises/:exerciseId', authenticateToken,  async (req, res) => {

    try {

        // Deleting exercise in the database, using the id to find it and the workoutId to avoid another user deleting it
        const result = await pool.query(
            `DELETE FROM exercises
             WHERE id = $1
             AND workout_id = $2
             RETURNING id, workout_id;`,
            [req.params.exerciseId, req.params.workoutId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Exercise not found'
            });
        }

        res.status(204).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;