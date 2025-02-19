const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/tasks', async (req, res) => {
    const { taskName, taskStatus } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO tasks (taskName, taskStatus) VALUES (?, ?)',
            [taskName, taskStatus]
        );

        await db.query(
            'UPDATE tasks SET taskOrder = ? WHERE id = ?',
            [result.insertId, result.insertId]
        );

        res.status(201).send({
            id: result.insertId,
            taskName,
            taskStatus,
            taskOrder: result.insertId
        });
    } catch (error) {
        console.error('Error while creating task', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks');
        res.send(rows);
    } 
    catch (error) {
        console.error('Error while showing all tasks', error);
        res.status(500).send('Internal Server Error');
    }
});

router .get('/tasks/:status', async (req, res) => {
    const statusVal = (req.params.status);

    try {
        let queryResult;
        if (statusVal === "active") {
            queryResult = ('SELECT * FROM tasks WHERE taskStatus = "active"');
        }
        else if (statusVal === "completed") {
            queryResult = ('SELECT * FROM tasks WHERE taskStatus = "completed"');
        }
        else {
            return res.status(400).send('Invalid status parameter');
        }
        const [rows] = await db.query(queryResult);
        res.send(rows);
    }
    catch(error) {
        console.error('Error while showing tasks, on status basis', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/tasks/:id', async (req, res) => {

    const taskId = parseInt(req.params.id, 10);
    const { taskName, taskStatus } = req.body;
    
    if (isNaN(taskId)) {
        return res.status(400).send('Invalid task ID');
    }
    
    try {
        const [result] = await db.query(
            'UPDATE tasks SET taskName = ?, taskStatus = ? WHERE id = ?',
            [taskName, taskStatus, taskId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        
        res.send({
            id: taskId,
            taskName,
            taskStatus
        });
    } 
    catch (error) {
        console.error('Error while updating task', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/tasks/order/:id', async (req, res) => {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
        return res.status(400).send('Invalid tasks data');
    }

    try {
        const updatePromises = tasks.map(task =>
            db.query('UPDATE tasks SET taskOrder = ? WHERE id = ?', [task.taskOrder, task.id])
        );

        await Promise.all(updatePromises);

        res.status(200).send('Task order updated');
    } 
    catch (error) {
        console.error('Error while updating task order', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    
    if (isNaN(taskId)) {
        return res.status(400).send('Invalid task ID');
    }
    
    try {
        const [result] = await db.query(
            'DELETE FROM tasks WHERE id = ?',
            [taskId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Task not found');
        }
        else {
            return res.status(200).send('Task deleted');
        }
    } 
    catch (error) {
        console.error('Error while deleting task', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;











// payload for update tasks 

// {
//     "tasks": [
//       { "id": 158, "taskOrder": 3 },
//       { "id": 159, "taskOrder": 1 },
//       { "id": 157, "taskOrder": 2 },
//       { "id": 160, "taskOrder": 4 }
//     ]
//   }