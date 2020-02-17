require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
})

const getLists = async (request, response) => {
  try {
    await pool.query(
      'SELECT * FROM lists ORDER BY id ASC',
      (error, results) => {
        if (error) throw error
        response.status(200).send(results.rows)
      }
    )
  } catch (e) {
    response.status(500).send(['unable to fetch data'])
  }
}

const getListById = async (request, response) => {
  const id = request.params.id
  try {
    await pool.query(
      `SELECT * FROM lists WHERE id =${id}`,
      (error, results) => {
        if (error) throw error
        response.status(200).send(results.rows)
      }
    )
  } catch (e) {
    response.status(500).send(['unable to fetch data'])
  }
}

const createList = async (request, response) => {
  const { name } = request.body
  try {
    await pool.query(
      `INSERT INTO lists (name) VALUES ('${name}') RETURNING id`,
      (error, results) => {
        if (error) throw error
        response.status(201).send(results.rows[0].id.toString())
      }
    )
  } catch (e) {
    response.status(500).send(['unable to create data'])
  }
}

const updateList = async (request, response) => {
  const id = request.params.id
  const { name } = request.body
  try {
    await pool.query(
      `UPDATE lists SET name = '${name}' where id = ${id}`,
      (error, results) => {
        if (error) throw error
        response.status(200).send([`List modified with ID: ${id}`])
      }
    )
  } catch (e) {
    response.status(500).send(['unable to update data'])
  }
}

const deleteList = async (request, response) => {
  const id = request.params.id
  try {
    await pool.query(`DELETE FROM lists WHERE id = ${id}`, (error, results) => {
      if (error) throw error
      response.status(200).send(['data deleted'])
    })
  } catch (e) {
    response.status(500).send(['unable to delete data'])
  }
}

const getTasks = async (request, response) => {
  // console.log('getTASK')
  const id = request.params.id
  // console.log(id)
  try {
    await pool.query(
      `SELECT * FROM tasks WHERE id = ${id} ORDER BY tid ASC`,
      (error, results) => {
        if (error) throw error
        response.status(200).send(results.rows)
      }
    )
  } catch (e) {
    response.status(500).send(['unable to fetch tasks'])
  }
}

const createTask = async (request, response) => {
  const id = request.params.id
  const { tname, checked, priority, date, notes } = request.body
  try {
    await pool.query(
      `INSERT INTO tasks (checked,tname,priority,date,notes,id) VALUES ('${checked}','${tname}','${priority}','${date}','${notes}','${id}') RETURNING tid`,
      (error, results) => {
        if (error) throw error
        console.log('result')
        console.log(results.rows)
        response.status(201).send(results.rows[0].tid.toString())
      }
    )
  } catch (e) {
    response.status(500).send(['unable to create task'])
  }
}

const updateTask = async (request, response) => {
  const tid = request.params.tid
  const id = request.params.id
  const column = request.body.column
  const value = request.body.value
  console.log(`${column} , ${value}`)
  // const { name, checked, priority, date, notes } = request.body
  try {
    await pool.query(
      `UPDATE tasks SET ${column} = '${value}'
      where tid = ${tid}`,
      (error, results) => {
        if (error) throw error
        response.status(200).send(['Task renamed'])
      }
    )
  } catch (e) {
    response.status(500).send(['unable to update task'])
  }
}

const deleteTask = async (request, response) => {
  const { tid, id } = request.params
  // const id = request.params.id
  try {
    await pool.query(
      `DELETE FROM tasks WHERE tid = ${tid}`,
      (error, results) => {
        if (error) throw error
        response
          .status(200)
          .send([`task deleted with ID: ${tid} of list with ID: ${id}`])
      }
    )
  } catch (e) {
    response.status(500).send(['unable to delete task'])
  }
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
