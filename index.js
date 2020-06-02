const express = require('express')
const db = require('./queries')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('public'))

app.get('/lists', db.getLists)
app.get('/lists/:id', db.getListById)
app.post('/lists', db.createList)
app.put('/lists/:id', db.updateList)
app.delete('/lists/:id', db.deleteList)

app.get('/lists/:id/tasks', db.getTasks)
app.post('/lists/:id/tasks', db.createTask)
app.put('/lists/:id/tasks/:tid', db.updateTask)
app.delete('/lists/:id/tasks/:tid', db.deleteTask)

app.get('/todayTasks', db.getTodayTasks)
app.get('/scheduledTasks', db.getScheduledTasks)
app.delete('/clearCompletedTasks/:id', db.clearCompletedTasks)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
