const listPage = document.querySelector('.listPage')
const listContainer = document.querySelector('.listItemsContainer')
const newListButton = document.querySelector('.newListBtn')

const taskPage = document.querySelector('.taskPage')
const taskContainer = document.querySelector('.taskContainer')
const back = document.querySelector('.backButton')

newListButton.addEventListener('click', createList)

// localStorage.clear()

let list = JSON.parse(localStorage.getItem('todo')) || []
let count = list.length ? Number(list[list.length - 1]) : 0

let todoCount

function elt(type, props, ...children) {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  } doneUpdateSelector
  return dom
}

if (list.length) listFromLocalStorage(list)

function listFromLocalStorage(lists) {
  for (const list of lists) {
    const cnt = JSON.parse(localStorage.getItem(`${list}`))
    const res = elt(
      'div',
      { id: list, className: 'listItems' },
      elt('div', { id: list, className: 'lists' }),
      elt('p', { id: list, className: 'listName', textContent: cnt.name })
    ) // check with id
    listContainer.appendChild(res)
  }
  divSelectorList()
  pSelectorList()
}

function createList() {
  const listName = prompt('Enter List name')
  if (listName) {
    count++
    const res = elt(
      'div',
      {
        id: count,
        className: 'listItems'
      },
      elt('div', { id: count, className: 'lists' }),
      elt('p', { id: count, className: 'listName', innerText: listName }),
      elt('i')
    )
    listContainer.appendChild(res)
    list.push(res.id)
    localStorage.setItem(
      `${res.id}`,
      JSON.stringify({ id: res.id, name: listName, todos: [] })
    )
    localStorage.setItem('todo', JSON.stringify(list))
    pSelectorList()
    divSelectorList()
  }
}
function divSelectorList() {
  const selectDiv = document.querySelectorAll('.lists')
  for (const list of Array.from(selectDiv)) {
    list.addEventListener('mousedown', event => {
      event.preventDefault()
      if (event.button === 0) {
        openFromList(event)
      } else if (event.button === 2) {
        event.preventDefault()
        selectList(event)
      }
    })
    list.addEventListener('contextmenu', event => event.preventDefault())
    list.addEventListener('dblclick', renameList)
  }
}

function pSelectorList() {
  const selectP = document.querySelectorAll('.listName')
  for (const p of Array.from(selectP)) {
    p.addEventListener('mousedown', event => {
      event.preventDefault()
      if (event.button === 0) {
        // deleteListButtonEnabler(event)
        // openFromList(event)
      } else if (event.button === 2) {
        event.preventDefault()
        selectList(event)
      }
    })
    p.addEventListener('contextmenu', event => event.preventDefault())
    p.addEventListener('dblclick', renameList)
  }
}

function renameList(event) {
  const newName = prompt('new list name')
  const listId = event.target.id
  let list = JSON.parse(localStorage.getItem(`${listId}`))
  const listName = document.querySelectorAll(`.${event.target.className}`)
  for (const lists of Array.from(listName)) {
    if (lists.id === `${listId}`) lists.textContent = newName
  }
  list["name"] = newName
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}
function selectList() { }

function openFromList(event) {
  listPage.style = 'display:none'
  taskPage.style = 'display:block'
  taskContainer.innerHTML = ''
  const id = event.target.id // Check with the id case
  const input = elt('input', {
    type: 'text',
    className: 'taskInput',
    placeholder: 'Enter the Task Name'
  })
  taskContainer.appendChild(input)
  const taskInput = document.querySelector('.taskInput')
  taskFromLocalStorage(event)
  taskInput.addEventListener('keydown', event => {
    if (event.target.value && event.keyCode === 13) {
      addTask(event, id)
    }
  })
}

function taskFromLocalStorage(event) {
  const taskList = JSON.parse(localStorage.getItem(`${event.target.id}`))
  const lTodos = taskList.todos
  todoCount = 0
  if (lTodos) {
    for (const todo of lTodos) {
      const div = elt(
        'div',
        { id: todo.tId, className: 'taskFull' },
        elt(
          'div',
          { className: `task ${todo.tId}` },
          elt('input', {
            type: 'checkbox',
            className: `checkbox ${todo.tId}`,
            checked: `${todo.checkbox}`
          }),
          elt('p', {
            className: `taskName ${todo.tId}`,
            textContent: todo.tName
          })
        ),
        elt(
          'div',
          {
            className: 'taskFeatures'
          },
          elt('p', {
            className: `notes ${todo.tId}`,
            textContent: 'Notes'
          }),
          elt('p', {
            className: `dueDate ${todo.tId}`,
            textContent: 'Due Date'
          }),
          elt('textarea', {
            className: `textNotes ${todo.tId}`,
            name: 'notes',
            value: `${todo.notes}`
          }),
          elt('input', {
            type: 'date',
            className: `date ${todo.tId}`,
            value: `${todo.date}`
          }),
          elt('p', {
            className: `priority ${todo.tId}`,
            textContent: 'Priority'
          }),
          elt(
            'select',
            {
              name: 'priority',
              className: `prioritySelect ${todo.tId}`
            },
            elt('option', { value: 'none', textContent: 'None' }),
            elt('option', {
              value: 'low',
              textContent: 'Low'
            }),
            elt('option', {
              value: 'medium',
              textContent: 'Medium'
            }),
            elt('option', { value: 'high', textContent: 'High' })
          ),
          elt('button', {
            className: `deleteTask ${todo.tId}`,
            textContent: 'Delete'
          })
        )
      )
      taskContainer.appendChild(div)
      const priority = document.querySelectorAll('.prioritySelect')
      let num = `${todo.priority}`
      if (num === 'none') num = 0
      else if (num === 'low') num = 1
      else if (num === 'medium') num = 2
      else num = 3
      const priorities = priority[priority.length - 1]
      priorities.selectedIndex = num
      todoCount = `${todo.tId}`
      todoCount = Number(todoCount.slice(todoCount.indexOf('|') + 1))
    }
  }

  pTaskNameOpener()
  doneUpdateSelector()
  notesUpdateSelector()
  dateChangeSelector()
  deleteTaskSelector()
  priorityChangeSelector()
}

function addTask(event, listId) {
  const taskName = event.target.value // required for updating in localStorage
  event.target.value = ''
  todoCount++

  const div = elt(
    'div',
    { id: `${listId}|${todoCount}`, className: 'taskFull' },
    elt(
      'div',
      {
        className: `task ${listId}|${todoCount}`
      },
      elt('input', {
        type: 'checkbox',
        className: `checkbox ${listId}|${todoCount}`
      }),
      elt('p', {
        className: `taskName ${listId}|${todoCount}`,
        textContent: taskName
      })
    ),
    elt(
      'div',
      {
        className: `taskFeatures ${listId}|${todoCount}`
      },
      elt('p', {
        className: `notes ${listId}|${todoCount}`,
        textContent: 'Notes'
      }),
      elt('p', {
        className: `dueDate ${listId}|${todoCount}`,
        textContent: 'Due Date'
      }),
      elt('textarea', {
        className: `textNotes ${listId}|${todoCount}`,
        name: 'notes'
      }),
      elt('input', {
        type: 'date',
        className: `date ${listId}|${todoCount}`
      }),
      elt('p', {
        className: `priority ${listId}|${todoCount}`,
        textContent: 'priority'
      }),
      elt(
        'select',
        {
          name: `priority ${listId}|${todoCount}`,
          className: 'prioritySelect'
        },
        elt('option', { value: 'none', textContent: 'None' }),
        elt('option', { value: 'low', textContent: 'Low' }),
        elt('option', { value: 'medium', textContent: 'Medium' }),
        elt('option', { value: 'high', textContent: 'High' })
      ),
      elt('button', {
        className: `deleteTask ${listId}|${todoCount}`,
        textContent: 'Delete'
      })
    )
  )
  taskContainer.appendChild(div)
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  list['todos'].push({
    tId: div.id,
    checked: false,
    tName: `${taskName}`,
    priority: 'none',
    date: 'No Date Set',
    notes: ''
  })
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  deleteTaskSelector()
  dateChangeSelector()
  priorityChangeSelector()
  notesUpdateSelector()
  doneUpdateSelector()
  pTaskNameOpener()
}

back.addEventListener('click', backToListPage)

function pTaskNameOpener() {

}

function backToListPage(event) {
  listPage.style = 'display:block'
  taskPage.style = 'display:none'
  listContainer.innerHTML = ''
  listFromLocalStorage(list)
}

function doneUpdateSelector() {
  const checkDone = document.querySelectorAll('.checkbox')
  for (const done of Array.from(checkDone)) {
    done.addEventListener('change', doneUpdate)
  }
}
function doneUpdate(event) {
  const taskId = event.target.parentNode.parentNode.id
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  const todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos[count].checked = event.target.checked
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

function notesUpdateSelector() {
  const notes = document.querySelectorAll('.textNotes')
  for (const note of Array.from(notes)) {
    note.addEventListener('keydown', event => {
      if (event.target.value && event.keyCode === 13) {
        notesUpdate(event)
      }
    })
  }
}
function notesUpdate(event) {
  const taskId = event.target.parentNode.parentNode.id
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  const todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos[count].notes = event.target.value
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

function priorityChangeSelector() {
  const priority = document.querySelectorAll('.prioritySelect')
  for (const priorities of Array.from(priority)) {
    priorities.addEventListener('change', priorityUpdate)
  }
}
function priorityUpdate(event) {
  const taskId = event.target.parentNode.parentNode.id
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  const todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos[count].priority = event.target.value
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

function dateChangeSelector() {
  const dateChange = document.querySelectorAll('.date')
  for (const date of Array.from(dateChange)) {
    date.addEventListener('change', dateUpdate)
  }
}
function dateUpdate(event) {
  const taskId = event.target.parentNode.parentNode.id
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  let todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos[count].date = event.target.value
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

function deleteTaskSelector() {
  const deleteTaskButton = document.querySelectorAll('.deleteTask')
  for (let task of Array.from(deleteTaskButton)) {
    task.addEventListener('click', deleteTask)
  }
}

function deleteTask(event) {
  const taskId = event.target.parentNode.parentNode.id
  let element = document.getElementById(taskId)
  element.parentNode.removeChild(element)
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  let todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos = todos.slice(0, count).concat(todos.slice(count + 1))
  list.todos = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

// delete for list add fontawsome and implement
// ptaskselector
// divtaskselector
// on click open task features
// pOnHover
// ponclick to textbox
// on enter update name and back to p tag
// 