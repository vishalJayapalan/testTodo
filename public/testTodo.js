const listPage = document.querySelector('.listPage')
const listContainer = document.querySelector('.listItemsContainer')
const newListButton = document.querySelector('.newListBtn')
const addListContainer = document.querySelector('.addListContainer')
const searchButton = document.querySelector('.searchBtn')
const scheduledButton = document.querySelector('.scheduledBtn')
const todayButton = document.querySelector('.todayBtn')
// const listButton = document.querySelector('.listBtn')

const taskPage = document.querySelector('.taskPage')
const taskContainer = document.querySelector('.taskContainer')
const back = document.querySelector('.backButton')
const clearCompleted = document.querySelector('.clearCompletedBtn')

newListButton.addEventListener('click', listInput)
searchButton.addEventListener('click', searchListCreator)

scheduledButton.addEventListener('click', showScheduledList)
todayButton.addEventListener('click', showTodayList)

clearCompleted.addEventListener('click', event => {
  clearCompletedTask(event.target.id)
})
// localStorage.clear()

let list = JSON.parse(localStorage.getItem('todo')) || []

let count = list.length ? Number(list[list.length - 1]) : 0
let todoCount
// listButton.addEventListener('click', event => {
//   listContainer.innerHTML = ''
//   listFromLocalStorage(list)
// })

function showTodayList () {
  const tasksToShow = []
  const today = new Date()
  for (const lists of list) {
    const schList = JSON.parse(localStorage.getItem(`${lists}`))
    if (schList['todos'].length) {
      for (const schTodos of schList['todos']) {
        if (
          new Date(schTodos.date).toISOString().slice(0, 10) ===
          today.toISOString().slice(0, 10)
        ) {
          tasksToShow.push({
            tId: schTodos.tId,
            checked: schTodos.checked,
            tName: schTodos.tName,
            priority: schTodos.priority,
            date: schTodos.date,
            notes: schTodos.notes
          })
        }
      }
    }
  }
  taskContainer.innerHTML = ''
  listPage.style = 'display:none'
  taskPage.style = 'display:block'
  if (tasksToShow.length) {
    taskCreatorFunction(tasksToShow, true)
    featureOpenSelectorTask()
    pTaskSelector()
    doneUpdateSelector()
  } else {
    const nothing = document.createElement('p')
    taskContainer.appendChild(nothing)
    nothing.textContent = 'No Tasks For today'
  }
}

function showScheduledList () {
  const tasksToShow = []
  for (const lists of list) {
    const schList = JSON.parse(localStorage.getItem(`${lists}`))
    if (schList['todos'].length) {
      for (const schTodos of schList['todos']) {
        if (schTodos.date !== false) {
          tasksToShow.push({
            tId: schTodos.tId,
            checked: schTodos.checked,
            tName: schTodos.tName,
            priority: schTodos.priority,
            date: schTodos.date,
            notes: schTodos.notes
          })
        }
      }
    }
  }
  taskContainer.innerHTML = ''
  listPage.style = 'display:none'
  taskPage.style = 'display:block'
  if (tasksToShow.length) {
    taskCreatorFunction(tasksToShow, true)
    featureOpenSelectorTask()
    pTaskSelector()
    doneUpdateSelector()
  } else {
    const nothing = document.createElement('p')
    taskContainer.appendChild(nothing)
    nothing.textContent = 'No Tasks Scheduled'
  }
}

function elt (type, props, ...children) {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  // doneUpdateSelector
  return dom
}

if (list.length) listFromLocalStorage(list)

function listFromLocalStorage (lists) {
  for (const list of lists) {
    const cnt = JSON.parse(localStorage.getItem(`${list}`))
    const res = elt(
      'div',
      { id: list, className: 'listItems' },
      elt('div', { id: list, className: 'lists' }),
      elt('i', { id: list, className: 'fas fa-archive' }),
      elt('p', { id: list, className: 'listName', textContent: cnt.name })
    ) // check with id
    listContainer.appendChild(res)
  }
  deleteSelectorList()
  divSelectorList()
  pSelectorList()
}

function searchListCreator () {
  searchButton.disabled = true
  const searchList = document.querySelector('.searchList')
  searchList.style.display = 'block'
  searchList.focus()
  searchList.placeholder = 'Search......'
  searchList.addEventListener('blur', event => {
    event.target.value = ''
    searchList.style.display = 'none'
    listContainer.style.display = 'flex'
    searchButton.disabled = false
    listContainer.innerHTML = ''
    listFromLocalStorage(list)
  })
  searchList.addEventListener('keyup', event => {
    let tempList = []
    for (const newList of list) {
      let lists = JSON.parse(localStorage.getItem(`${newList}`))
      if (
        lists['name'].toLowerCase().includes(event.target.value.toLowerCase())
      ) {
        tempList.push(newList)
      }
    }
    listContainer.innerHTML = ''
    listFromLocalStorage(tempList)
    if (event.keyCode === 13) {
      event.target.value = ''
      searchList.style.display = 'none'
      listContainer.style.display = 'flex'
      searchButton.disabled = false
    }
  })
}

function listInput () {
  const addList = document.querySelector('.addList')
  addList.style.display = 'block'
  addListContainer.appendChild(addList)
  addList.placeholder = 'Enter ListName'
  listContainer.style.display = 'none'
  addList.focus()
  addList.addEventListener('blur', event => {
    event.target.value = ''
    addList.style.display = 'none'
    listContainer.style.display = 'flex'
  })
  addList.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      addList.style.display = 'none'
      listContainer.style.display = 'flex'
    }
    if (event.target.value && event.keyCode === 13) {
      createList(event.target.value)
      event.target.value = ''
    }
  })
}

function createList (listName) {
  if (listName) {
    count++
    const res = elt(
      'div',
      {
        id: count,
        className: 'listItems'
      },
      elt('div', { id: count, className: 'lists' }),
      elt('i', { id: count, className: 'fas fa-archive' }),
      elt('p', { id: count, className: 'listName', innerText: listName })
    )
    listContainer.appendChild(res)
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

function deleteSelectorList () {
  const deleteImage = document.querySelectorAll('.fa-archive')
  for (const deletes of Array.from(deleteImage)) {
    deletes.addEventListener('click', deleteList)
  }
}
function deleteList (event) {
  const listId = event.target.id
  const deleteElement = document.getElementById(`${listId}`)
  deleteElement.parentNode.removeChild(deleteElement)
  list = list.filter(a => a != listId)
  localStorage.removeItem(`${listId}`)
  localStorage.setItem('todo', JSON.stringify(list))
}

function divSelectorList () {
  const selectDiv = document.querySelectorAll('.lists')
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
  }
}

function pSelectorList () {
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
  }
}

function renameInput (event) {
  const listId = event.target.id
  const listClass = event.target.className
  const newInput = elt('input', {
    id: `${listId}`,
    className: `${listClass}`,
    value: `${event.target.textContent}`
  })
  const listName = document.querySelectorAll(`.${listClass}`)
  for (const list of Array.from(listName)) {
    if (list.id === listId) {
      list.parentNode.replaceChild(newInput, list)
      newInput.focus()
      newInput.addEventListener('keydown', event => {
        if (event.target.value && event.keyCode === 13) {
          newInput.parentNode.replaceChild(list, newInput)
          renameList(event)
        }
      })
    }
  }
}

function renameList (event) {
  const listId = event.target.id
  const listClass = event.target.className
  const newName = event.target.value
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  const listName = document.querySelectorAll(`.${listClass}`)
  for (const lists of Array.from(listName)) {
    if (lists.id === `${listId}`) lists.textContent = newName
  }
  list['name'] = newName
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

function selectList () {
  console.log('Work in Progress')
}

function openFromList (listId) {
  listPage.style = 'display:none'
  taskPage.style = 'display:block'
  taskContainer.innerHTML = ''
  const input = elt('input', {
    type: 'text',
    className: 'taskInput',
    placeholder: 'Enter the Task Name'
  })
  taskContainer.appendChild(input)
  const taskInput = document.querySelector('.taskInput')
  taskFromLocalStorage(listId) // changed here for TaskFromLocalStorage
  taskInput.addEventListener('keydown', event => {
    if (event.target.value && event.keyCode === 13) {
      addTask(event, listId)
    }
  })
}

function taskCreatorFunction (lTodos, fromLocal = false) {
  const listId = lTodos[0].tId.slice(0, lTodos[0].tId.indexOf('|'))
  const taskName = lTodos[0].tName
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
          checked: todo.checked || false
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
      ),
      elt('hr', { id: `${todo.tId}`, className: 'hr' }),
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
          value: `${todo.notes}` || ''
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
          elt('option', { value: '0', textContent: 'None' }),
          elt('option', {
            value: '1',
            textContent: 'Low'
          }),
          elt('option', {
            value: '2',
            textContent: 'Medium'
          }),
          elt('option', { value: '3', textContent: 'High' })
        ),
        elt('button', {
          className: `deleteTask ${todo.tId}`,
          textContent: 'Delete'
        })
      )
    )
    if (fromLocal) {
      taskContainer.appendChild(div)
      const priority = document.querySelectorAll('.prioritySelect')
      const num = todo.priority
      const priorities = priority[priority.length - 1]
      priorities.selectedIndex = num
      let requiredHr
      const hrs = document.querySelectorAll('.hr')
      for (const hr of hrs) {
        if (hr.id === todo.tId) {
          requiredHr = hr
          break
        }
      }
      const priorityColor = [
        'border: 1px solid yellow',
        'border: 1px solid green',
        'border: 1px solid blue',
        'border: 1px solid red'
      ]
      requiredHr.style = priorityColor[num]
      todoCount = `${todo.tId}`
      todoCount = Number(todoCount.slice(todoCount.indexOf('|') + 1))
      if (todo.checked) {
        const taskNameP = document.querySelectorAll('.taskName')
        for (const task of Array.from(taskNameP)) {
          if (task.id === todo.tId) {
            task.style = 'text-decoration: line-through'
          }
        }
      }
    } else {
      taskContainer.appendChild(div)
      const list = JSON.parse(localStorage.getItem(`${listId}`))
      list['todos'].push({
        tId: div.id,
        checked: false,
        tName: `${taskName}`,
        priority: 0,
        date: false,
        notes: ''
      })
      localStorage.setItem(`${listId}`, JSON.stringify(list))
    }
  }
}

function taskFromLocalStorage (listId) {
  clearCompleted.id = listId // comment this and open above line // changed event
  const taskList = JSON.parse(localStorage.getItem(`${listId}`)) // comment this and open above line
  const lTodos = taskList.todos
  todoCount = 0
  if (lTodos.length) {
    taskCreatorFunction(lTodos, true)
  }

  featureOpenSelectorTask()
  pTaskSelector()
  doneUpdateSelector()
}

function addTask (event, listId) {
  const taskName = event.target.value // required for updating in localStorage
  event.target.value = ''
  todoCount++
  const lTodos = [{ tId: `${listId}|${todoCount}`, tName: `${taskName}` }]
  taskCreatorFunction(lTodos, false)
  // above is for adding task
  doneUpdateSelector()
  featureOpenSelectorTask()
  pTaskSelector()
}

back.addEventListener('click', backToListPage)

function pTaskSelector () {
  const selectP = document.querySelectorAll('.taskName')
  for (const p of Array.from(selectP)) {
    p.addEventListener('click', renameTaskInput)
  }
}

function renameTaskInput (event) {
  const taskId = event.target.id
  const taskClass = event.target.className
  const newInput = elt('input', {
    id: `${taskId}`,
    className: `${taskClass}`,
    value: `${event.target.textContent}`,
    type: 'text'
  })
  const taskName = document.querySelectorAll('.taskName')
  for (const task of Array.from(taskName)) {
    if (task.id === taskId) {
      task.parentNode.replaceChild(newInput, task)
      newInput.focus()
      newInput.addEventListener('keydown', event => {
        if (event.target.value && event.keyCode === 13) {
          newInput.parentNode.replaceChild(task, newInput)
          renameTask(event)
        }
      })
    }
  }
}

function renameTask (event) {
  const taskId = event.target.id
  const newName = event.target.value
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  const todos = list.todos
  const taskName = document.querySelectorAll('.taskName')
  for (const tasks of Array.from(taskName)) {
    if (tasks.id === `${taskId}`) tasks.textContent = newName
  }
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos[count].tName = newName
  list.todos = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
}

function featureOpenSelectorTask () {
  const featureTask = document.querySelectorAll('.openTaskFeaturesBtn')
  for (const task of Array.from(featureTask)) {
    task.addEventListener('click', featureTaskOpener)
  }
}
function featureTaskOpener (event) {
  let taskId = event.target.id
  const taskFeatures = document.querySelectorAll('.taskFeatures')
  for (const task of Array.from(taskFeatures)) {
    if (task.id === taskId) {
      if (task.style.display == 'none') {
        task.style = 'display:grid'
        continue
      } else {
        task.style.display = 'none'
        continue
      }
    }
    task.style = 'display:none'
  }
  deleteTaskSelector()
  dateChangeSelector()
  priorityChangeSelector()
  notesUpdateSelector()
}

function backToListPage (event) {
  listPage.style = 'display:block'
  taskPage.style = 'display:none'
  listContainer.innerHTML = ''
  listFromLocalStorage(list)
}

function doneUpdateSelector () {
  const checkDone = document.querySelectorAll('.checkbox')
  for (const done of Array.from(checkDone)) {
    done.addEventListener('change', doneUpdate)
  }
}
function doneUpdate (event) {
  const taskId = event.target.parentNode.parentNode.id
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  let todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  if (event.target.checked) {
    let taskNameP = document.querySelectorAll('.taskName')
    for (const task of Array.from(taskNameP)) {
      if (task.id === taskId) {
        task.style = 'text-decoration: line-through'
      }
    }
  } else {
    let taskNameP = document.querySelectorAll('.taskName')
    for (const task of Array.from(taskNameP)) {
      if (task.id === taskId) {
        task.style = 'text-decoration: underline;'
      }
    }
  }
  todos[count].checked = event.target.checked
  todos = dateSorting(todos)
  todos = prioritySorting(todos)
  todos = checkedSorting(todos)
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  taskContainer.innerHTML = ''
  openFromList(listId)
}

function prioritySorting (array) {
  array.sort((a, b) => {
    a = a.priority
    b = b.priority
    return a > b ? -1 : a < b ? 1 : 0
  })
  return array
}

function dateSorting (array) {
  array.sort(function (a, b) {
    a = new Date(a.date)
    b = new Date(b.date)
    const c = new Date(false)
    if (a.getTime() === c.getTime() && b.getTime() !== c.getTime()) {
      return 1
    }
    if (b.getTime() === c.getTime() && a.getTime() !== c.getTime()) {
      return -1
    }
    if (b.getTime() === new Date(false) && a.getTime() === c.getTime()) {
      return 0
    }
    return a < b ? -1 : a < b ? 1 : 0
  })
  return array
}

function checkedSorting (array) {
  array.sort((a, b) => {
    a = a.checked
    b = b.checked
    if (a === b) return 0
    if (a === false) return -1
    if (b === false) return 1
  })
  return array
}

function clearCompletedTask (tId) {
  const lists = JSON.parse(localStorage.getItem(`${tId}`))
  let todos = lists.todos
  todos = todos.filter(a => a.checked === false)
  lists.todos = todos
  localStorage.setItem(`${tId}`, JSON.stringify(lists))
  taskContainer.innerHTML = ''
  openFromList(tId)
}

function notesUpdateSelector () {
  const notes = document.querySelectorAll('.textNotes')
  for (const note of Array.from(notes)) {
    note.addEventListener('change', notesUpdate)
  }
}
function notesUpdate (event) {
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

function priorityChangeSelector () {
  const priority = document.querySelectorAll('.prioritySelect')
  for (const priorities of Array.from(priority)) {
    priorities.addEventListener('change', priorityUpdate)
  }
}
function priorityUpdate (event) {
  const taskId = event.target.parentNode.parentNode.id
  const listId = taskId.slice(0, taskId.indexOf('|'))
  const list = JSON.parse(localStorage.getItem(`${listId}`))
  let todos = list.todos
  let count = 0
  for (const todo of todos) {
    if (todo.tId === taskId) break
    count++
  }
  todos[count].priority = event.target.value
  todos = dateSorting(todos)
  todos = prioritySorting(todos)
  todos = checkedSorting(todos)
  list['todos'] = todos
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  taskContainer.innerHTML = ''
  openFromList(listId)
}

function dateChangeSelector () {
  const dateChange = document.querySelectorAll('.date')
  for (const date of Array.from(dateChange)) {
    date.addEventListener('change', dateUpdate)
  }
}
function dateUpdate (event) {
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
    todos = dateSorting(todos)
    todos = prioritySorting(todos)
    todos = checkedSorting(todos)
    list['todos'] = todos
    localStorage.setItem(`${listId}`, JSON.stringify(list))
    taskContainer.innerHTML = ''
    openFromList(listId)
  }
}

function deleteTaskSelector () {
  const deleteTaskButton = document.querySelectorAll('.deleteTask')
  for (const task of Array.from(deleteTaskButton)) {
    task.addEventListener('click', deleteTask)
  }
}

function deleteTask (event) {
  const taskId = event.target.parentNode.parentNode.id
  const element = document.getElementById(taskId)
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
