const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const delData = await Task.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });
    if (!delData) {
      return res.status(404).send();
    }

    res.send(delData);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {}

  if(req.query.sortBy){
    const keyVal = req.query.sortBy.split('_')
    const key = keyVal[0]
    const val =  keyVal[1] === 'asc' ? 1 : -1
    sort[key] = val
  }
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  try {
    await req.user
      .populate({
        path: 'tasks',
       match,
        options:{
          limit:parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    // const data = await Task.findById(id);
    const data = await Task.findOne({ _id: id, owner: req.user._id });

    if (!data) {
      return res.status(400).send();
    }
    res.send(data);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const availableFields = ['completed', 'description'];
  const dataFields = Object.keys(req.body);
  const isValid = dataFields.every((data) => {
    return availableFields.includes(data);
  });

  if (!isValid) {
    return res.status(400).send('invalaid Update');
  }

  try {
    const id = req.params.id;
    const data = req.body;

    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    dataFields.forEach((dataField) => {
      task[dataField] = data[dataField];
    });

    task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
