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
      elt('i', { id: list, className: "fas fa-archive" }),
      elt('p', { id: list, className: 'listName', textContent: cnt.name })
    ) // check with id
    listContainer.appendChild(res)
  } deleteSelectorList()
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
      elt('i', { id: count, className: "fas fa-archive" }),
      elt('p', { id: count, className: 'listName', innerText: listName })
    )
    listContainer.appendChild(res)
    console.log(list)
    list.push(res.id)
    localStorage.setItem(
      `${res.id}`,
      JSON.stringify({ id: res.id, name: listName, todos: [] })
    )
    localStorage.setItem('todo', JSON.stringify(list))
    deleteSelectorList()
    pSelectorList()
    divSelectorList()
  }
}

function deleteSelectorList() {
  const deleteImage = document.querySelectorAll('.fa-archive')
  for (const deletes of Array.from(deleteImage)) {
    deletes.addEventListener('click', deleteList)
  }
}
function deleteList(event) {
  const listId = event.target.id
  // console.log(listId + " list id")
  const deleteElement = document.getElementById(`${listId}`)
  deleteElement.parentNode.removeChild(deleteElement)
  // let list = JSON.parse(localStorage.getItem('todo'))
  list = list.filter(a => a != listId)
  console.log(list)
  localStorage.removeItem(`${listId}`)
  localStorage.setItem('todo', JSON.stringify(list))
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
  if (newName) {
    const listId = event.target.id
    let list = JSON.parse(localStorage.getItem(`${listId}`))
    const listName = document.querySelectorAll(`.${event.target.className}`)
    for (const lists of Array.from(listName)) {
      if (lists.id === `${listId}`) lists.textContent = newName
    }
    list["name"] = newName
    localStorage.setItem(`${listId}`, JSON.stringify(list))
  }
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
            checked: todo.checked
          }),
          elt('p', {
            id: `${todo.tId}`,
            className: `taskName ${todo.tId}`,
            textContent: todo.tName
          }),
          elt('i', {
            id: `${todo.tId}`,
            className: `fas fa-angle-down openTaskFeaturesBtn ${todo.tId}`
          })
        ), elt('hr', { className: "hr" }),
        elt(
          'div',
          {
            id: `${todo.tId}`,
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

  // pTaskNameOpener()
  featureOpenSelectorTask()
  // pSelectorTask()
  doneUpdateSelector()
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
        id: `${listId}|${todoCount}`,
        className: `taskName ${listId}|${todoCount}`,
        textContent: taskName
      }),
      elt('i', {
        id: `${listId}|${todoCount}`,
        className: `fas fa-angle-down openTaskFeaturesBtn ${listId}|${todoCount}`
      })
    ),
    elt(
      'div',
      {
        id: `${listId}|${todoCount}`,
        className: `taskFeatures ${listId}|${todoCount}`
      }, elt('hr', {}),
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
    date: false,
    notes: ''
  })
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  doneUpdateSelector()
  featureOpenSelectorTask()
  // pSelectorTask()
  // pTaskNameOpener()
}

back.addEventListener('click', backToListPage)

function featureOpenSelectorTask() {
  const featureTask = document.querySelectorAll('.openTaskFeaturesBtn')
  for (const task of Array.from(featureTask)) {
    task.addEventListener('click', featureTaskOpener)
  }
}

function featureTaskOpener(event) {
  let taskId = event.target.id
  const taskFeatures = document.querySelectorAll('.taskFeatures')
  for (const task of Array.from(taskFeatures)) {
    if (task.id == taskId) {
      if (task.style.display == 'none') {
        task.style = 'display:grid'
        continue
      }
      else {
        task.style.display = "none"
        continue
      }
    }
    task.style = "display:none"
  }
  deleteTaskSelector()
  dateChangeSelector()
  priorityChangeSelector()
  notesUpdateSelector()
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
    note.addEventListener('change', notesUpdate)
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
  todos.sort(function (a, b) {
    a = new Date(a.date)
    b = new Date(b.date)
    const c = new Date(false)
    if (a.getTime() == c.getTime() && b.getTime() != c.getTime()) {
      return 1
    }
    else if (b.getTime() == c.getTime() && a.getTime() != c.getTime()) {
      return -1
    }
    else if (b.getTime() == new Date(false) && a.getTime() == c.getTime()) {
      return 0
    }
    return a < b ? -1 : a < b ? 1 : 0
  })
  todos.sort((a, b) => {
    a = a.priority
    b = b.priority
    if (a === 'none') a = 0
    else if (a === 'low') a = 1
    else if (a === 'medium') a = 2
    else a = 3
    if (b === 'none') b = 0
    else if (b === 'low') b = 1
    else if (b === 'medium') b = 2
    else b = 3
    console.log(a)
    console.log(b)
    return a > b ? -1 : a < b ? 1 : 0
  })
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
  if (event.target.value) {
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
    todos.sort(function (a, b) {
      a = new Date(a.date)
      b = new Date(b.date)
      const c = new Date(false)
      if (a.getTime() == c.getTime() && b.getTime() != c.getTime()) {
        return 1
      }
      else if (b.getTime() == c.getTime() && a.getTime() != c.getTime()) {
        return -1
      }
      else if (b.getTime() == new Date(false) && a.getTime() == c.getTime()) {
        return 0
      }
      return a < b ? -1 : a < b ? 1 : 0
    })
    todos.sort((a, b) => {
      a = a.priority
      b = b.priority
      if (a === 'none') a = 0
      else if (a === 'low') a = 1
      else if (a === 'medium') a = 2
      else a = 3
      if (b === 'none') b = 0
      else if (b === 'low') b = 1
      else if (b === 'medium') b = 2
      else b = 3
      console.log(a)
      console.log(b)
      return a > b ? -1 : a < b ? 1 : 0

    })

    list['todos'] = todos
    localStorage.setItem(`${listId}`, JSON.stringify(list))
  }
}

function deleteTaskSelector() {
  const deleteTaskButton = document.querySelector('.deleteTask')
  // for (let task of Array.from(deleteTaskButton)) {
  //   task.addEventListener('click', deleteTask)
  // }
  deleteTaskButton.addEventListener('click', deleteTask)
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

// pOnHover
// ponclick to textbox
// on enter update name and back to p tag
// complete done features
// do sorting of tasks
