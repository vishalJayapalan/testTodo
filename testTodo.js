const listPage = document.querySelector('.listPage')
const listContainer = document.querySelector('.listItemsContainer')
const newListButton = document.querySelector('.newListBtn')
const addListContainer = document.querySelector('.addListContainer')
const searchButton = document.querySelector('.searchBtn')
const scheduledButton = document.querySelector('.scheduledBtn')
const todayButton = document.querySelector('.todayBtn')
const listButton = document.querySelector('.listBtn')

const taskPage = document.querySelector('.taskPage')
const taskContainer = document.querySelector('.taskContainer')
const back = document.querySelector('.backButton')
const clearCompleted = document.querySelector('.clearCompletedBtn')

// newListButton.addEventListener('click', createList)
newListButton.addEventListener('click', listInput)
searchButton.addEventListener('click', searchListCreator)

// scheduledButton.addEventListener('click', showScheduledList)
// todayButton.addEventListener('click', showTodayList)

clearCompleted.addEventListener('click', clearCompletedTask)
// localStorage.clear()

let list = JSON.parse(localStorage.getItem('todo')) || []
let count = list.length ? Number(list[list.length - 1]) : 0
let todoCount
// console.dir(listButton)
listButton.addEventListener('click', event => {
  listContainer.innerHTML = ''
  listFromLocalStorage(list)
})

function showTodayList() { }

function showCompletedList() { }

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

function searchListCreator() {
  // console.log("Hereee")
  searchButton.disabled = true
  const searchList = document.querySelector('.searchList')
  searchList.style.display = "block"
  searchList.focus()
  searchList.placeholder = 'Search......'
  searchList.addEventListener('blur', event => {
    event.target.value = ""
    searchList.style.display = "none"
    listContainer.style.display = "flex"
    searchButton.disabled = false
    listContainer.innerHTML = ''
    listFromLocalStorage(list)
  })
  searchList.addEventListener('keyup', event => {
    // console.log(event.target.value)
    // console.log(list)
    let tempList = []
    for (const newList of list) {
      let lists = JSON.parse(localStorage.getItem(`${newList}`))
      // console.log(lists)
      // console.log(lists.name)
      // console.log(lists['name'].includes(event.target.value))
      if (((lists['name']).toLowerCase()).includes((event.target.value).toLowerCase())) {
        tempList.push(newList)
      }
    }
    // listFromLocalStorage()
    listContainer.innerHTML = ''
    listFromLocalStorage(tempList)
    // 
    if (event.keyCode === 13) {
      event.target.value = ""
      searchList.style.display = "none"
      listContainer.style.display = "flex"
      searchButton.disabled = false
    }
  })
}

function listInput() {
  const addList = document.querySelector('.addList')
  addList.style.display = "block"
  addListContainer.appendChild(addList)
  addList.placeholder = 'Enter ListName'
  listContainer.style.display = 'none'
  addList.focus()
  addList.addEventListener('blur', event => {
    event.target.value = ""
    addList.style.display = "none"
    listContainer.style.display = "flex"
  })
  addList.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      addList.style.display = "none"
      listContainer.style.display = "flex"
    }
    if (event.target.value && event.keyCode === 13) {
      createList(event.target.value)
      event.target.value = ""
    }
  })
}

function createList(listName) {
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
    // console.log(list)
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
  const deleteElement = document.getElementById(`${listId}`)
  deleteElement.parentNode.removeChild(deleteElement)
  list = list.filter(a => a != listId)
  localStorage.removeItem(`${listId}`)
  localStorage.setItem('todo', JSON.stringify(list))
}

function divSelectorList() {
  const selectDiv = document.querySelectorAll('.lists')
  console.log(selectDiv)
  for (const list of Array.from(selectDiv)) {
    list.addEventListener('mousedown', event => {
      event.preventDefault()
      if (event.button === 0) {
        openFromList(event.target.id)
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
        renameInput(event)
      } else if (event.button === 2) {
        event.preventDefault()
        selectList(event)
      }
    })
    p.addEventListener('contextmenu', event => event.preventDefault())
    // p.addEventListener('dblclick', renameList)
  }
}

function renameInput(event) {
  let listId = event.target.id
  let listClass = event.target.className
  // console.log(listId + " listId")
  // console.log(listClass)
  const addList = document.querySelector('.addList')
  addList.style.display = "block"
  addListContainer.appendChild(addList)
  // console.log(event.target.textContent)
  addList.value = `${event.target.textContent}`
  // addList.placeholder = 'Enter ListName'
  listContainer.style.display = 'none'
  addList.focus()
  addList.addEventListener('blur', event => {
    event.target.value = ""
    addList.style.display = "none"
    listContainer.style.display = "flex"
  })
  addList.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      addList.style.display = "none"
      listContainer.style.display = "flex"
    }
    if (event.target.value && event.keyCode === 13) {
      renameList(event.target.value, listId, listClass)
      event.target.value = ""
    }
  })
}

function renameList(newName, listId, listClass) {
  // console.log(newName)
  // const newName = prompt('new list name')
  if (newName) {
    // const listId = event.target.id
    let list = JSON.parse(localStorage.getItem(`${listId}`))
    console.log(list)
    const listName = document.querySelectorAll(`.${listClass}`)
    for (const lists of Array.from(listName)) {
      if (lists.id === `${listId}`) lists.textContent = newName
    }
    list["name"] = newName
    localStorage.setItem(`${listId}`, JSON.stringify(list))
  }
}
function selectList() { }

function openFromList(listId) {
  listPage.style = 'display:none'
  taskPage.style = 'display:block'
  taskContainer.innerHTML = ''
  // const id = ListId // Check with the id case
  const input = elt('input', {
    type: 'text',
    className: 'taskInput',
    placeholder: 'Enter the Task Name'
  })
  taskContainer.appendChild(input)
  console.log(listId)
  const taskInput = document.querySelector('.taskInput')
  taskFromLocalStorage(listId) // changed here for TaskFromLocalStorage 
  taskInput.addEventListener('keydown', event => {
    if (event.target.value && event.keyCode === 13) {
      addTask(event, listId)
    }
  })
}

function taskFromLocalStorage(event) {
  // clearCompleted.id = event.target.id
  clearCompleted.id = event // comment this and open above line // changed event
  // console.log(clearCompleted.id)
  // const taskList = JSON.parse(localStorage.getItem(`${event.target.id}`))
  const taskList = JSON.parse(localStorage.getItem(`${event}`)) // comment this and open above line 
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
      if (todo.checked) {
        let taskNameP = document.querySelectorAll('.taskName')
        for (const task of Array.from(taskNameP)) {
          if (task.id == todo.tId) {
            const content = task.textContent
            task.textContent = ""
            let strike = document.createElement('strike')
            task.appendChild(strike)
            strike.textContent = content
          }
        }
      }
    }
  }

  featureOpenSelectorTask()
  pTaskSelector()
  doneUpdateSelector()
  // deleteTaskSelector()
  // dateChangeSelector()
  // priorityChangeSelector()
  // notesUpdateSelector()
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
    ), elt('hr', { className: 'hr' }),
    elt(
      'div',
      {
        id: `${listId}|${todoCount}`,
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
    date: false,
    notes: ''
  })
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  doneUpdateSelector()
  featureOpenSelectorTask()
  // deleteTaskSelector()
  pTaskSelector()
  // dateChangeSelector()
  // priorityChangeSelector()
  // notesUpdateSelector()

  // pSelectorTask()
}

back.addEventListener('click', backToListPage)

function pTaskSelector() {
  const selectP = document.querySelectorAll('.taskName')
  for (const p of Array.from(selectP)) {
    p.addEventListener('click', renameTask)
  }
}
function renameTask(event) {
  let lists = JSON.parse(localStorage.getItem(`${event.target.id}`))
  console.log(list)
  const taskId = event.target.id
  let newName = prompt('Enter new task')
  if (newName) {
    const selectP = document.querySelectorAll('.taskName')
    for (const p of Array.from(selectP)) {
      if (p.id == taskId) {
        p.textContent = newName
      }
    }
  }
}

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
        task.style.display = 'none'
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
  if (event.target.checked) {
    let taskNameP = document.querySelectorAll('.taskName')
    for (const task of Array.from(taskNameP)) {
      if (task.id == taskId) {
        const content = task.textContent
        task.textContent = ""
        let strike = document.createElement('strike')
        task.appendChild(strike)
        strike.textContent = content
      }
    }
  }
  else {
    let taskNameP = document.querySelectorAll('.taskName')
    for (const task of Array.from(taskNameP)) {
      if (task.id == taskId) {
        const content = task.firstChild.textContent
        task.innerHTML = ""
        task.textContent = content
      }
    }
  }
  todos[count].checked = event.target.checked
  // sorting based on date
  todos.sort(function (a, b) {
    a = new Date(a.date)
    b = new Date(b.date)
    const c = new Date(false)
    console.log(a)
    console.log(a.getTime())
    console.log(b)
    console.log(b.getTime())
    if (a.getTime() == c.getTime() && b.getTime() != c.getTime()) {
      return 1
    }
    if (b.getTime() == c.getTime() && a.getTime() != c.getTime()) {
      return -1
    }
    if (b.getTime() == new Date(false) && a.getTime() == c.getTime()) {
      return 0
    }
    return a < b ? -1 : a < b ? 1 : 0
  })
  // sorting based on priority
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
    return a > b ? -1 : a < b ? 1 : 0
  })
  // sorting based on done task
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  taskContainer.innerHTML = ''
  openFromList(listId)
  // taskFromLocalStorage(listId)
}

function clearCompletedTask(event) {
  // console.log(event.target.id)
  const lists = JSON.parse(localStorage.getItem(`${event.target.id}`))
  console.log(lists)
  let todos = lists.todos
  console.log(todos)
  todos = todos.filter(a => a.checked == false)
  console.log(todos)
  lists.todos = todos
  // list = list.filter(a => a != event.target.id)
  // console.log(list)
  localStorage.setItem(`${event.target.id}`, JSON.stringify(lists))
  taskContainer.innerHTML = ''
  openFromList(event.target.id)
  // taskFromLocalStorage(event.target.id)
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
    return a > b ? -1 : a < b ? 1 : 0
  })
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  taskContainer.innerHTML = ''
  openFromList(listId)
  // taskFromLocalStorage(listId) //this line was not there
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
      console.log("a " + a)
      console.log(a.getTime())
      console.log("b " + b)
      console.log(b.getTime())

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
    taskContainer.innerHTML = ''
    openFromList(listId)
    // taskFromLocalStorage(listId)
  }
}

function deleteTaskSelector() {
  const deleteTaskButton = document.querySelectorAll('.deleteTask')
  for (const task of Array.from(deleteTaskButton)) {
    task.addEventListener('click', deleteTask)
  }
  // deleteTaskButton.addEventListener('click', deleteTask)
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
