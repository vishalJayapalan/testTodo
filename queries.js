const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432
})

const getLists = (request, response) => {
  pool.query('SELECT * FROM lists ORDER BY id ASC', (error, results) => {
    if (error) throw error
    response.status(200).send(results.rows)
  })
}

const getListById = (request, response) => {
  const id = request.params.id

  pool.query(`SELECT * FROM lists WHERE id =${id}`, (error, results) => {
    if (error) throw error
    response.status(200).send(results.rows)
  })
}

const createList = (request, response) => {
  const { name } = request.body
  pool.query(
    `INSERT INTO lists (name) VALUES ('${name}') RETURNING id`,
    (error, results) => {
      if (error) throw error
      response.status(201).send(`List added with ID: ${results.rows[0].id}`)
    }
  )
}

const updateList = (request, response) => {
  const id = request.params.id
  const { name } = request.body

  pool.query(
    `UPDATE lists SET name = '${name}' where id = ${id}`,
    (error, results) => {
      if (error) throw error
      response.status(200).send(`List modified with ID: ${id}`)
    }
  )
}

const deleteList = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(`DELETE FROM lists WHERE id = ${id}`, (error, results) => {
    if (error) throw error
    response.status(200).send(`List deleted with ID: ${id}`)
  })
}

const getTasks = (request, response) => {
  pool.query('SELECT * FROM tasks ORDER BY tid ASC', (error, results) => {
    if (error) throw error
    response.status(200).send(results.rows)
  })
}

const createTask = (request, response) => {
  const { name, checked, priority, date, notes, id } = request.body
  pool.query(
    `INSERT INTO tasks (checked,tName,priority,date,notes,id) VALUES ('${checked}','${name}','${priority}','${date}','${notes}','${id}') RETURNING tid`,
    (error, results) => {
      if (error) throw error
      response
        .status(201)
        .send(
          `Task added with ID: ${results.rows[0].tid} to list with ID:${id} `
        )
    }
  )
}

const updateTask = (request, response) => {
  const tid = request.params.tid
  const id = request.params.id
  const { name, checked, priority, date, notes } = request.body

  pool.query(
    `UPDATE tasks SET tname = '${name}',
      checked = '${checked}',
      priority = '${priority}',
      date = '${date}',
      notes = '${notes}'
      where tid = ${tid}`,
    (error, results) => {
      if (error) throw error
      response
        .status(200)
        .send(`Task with ID: ${tid} modified in list with ID: ${id}`)
    }
  )
}

const deleteTask = (request, response) => {
  const tid = request.params.tid
  const id = request.params.id
  pool.query(`DELETE FROM tasks WHERE tid = ${tid}`, (error, results) => {
    if (error) throw error
    response
      .status(200)
      .send(`task deleted with ID: ${tid} of list with ID: ${id}`)
  })
}

module.exports = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  getTasks,
  createTask,
  updateTask,
  deleteTask
}
