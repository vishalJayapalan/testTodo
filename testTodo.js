const listPage = document.querySelector('.listPage')
const listContainer = document.querySelector('.listItemsContainer')
const newListButton = document.querySelector('.newListBtn')

const taskPage = document.querySelector('.taskPage')
const taskContainer = document.querySelector('.taskContainer')
const taskInput = document.querySelector('.taskInput')
const back = document.querySelector('.backButton')

newListButton.addEventListener('click', createList)

// localStorage.clear()

let list = JSON.parse(localStorage.getItem('todo')) || []
let count = list.length ? Number(list[list.length - 1]) : 0

let todoCount

function elt(type, props, ...children) {
  let dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (let child of children) {
    if (typeof child != 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  return dom
}

if (list.length) listFromLocalStorage(list)

// what is list
function listFromLocalStorage(list) {
  for (let i of list) {
    const cnt = JSON.parse(localStorage.getItem(`${i}`))
    console.log(cnt)
    const res = elt(
      'div',
      { id: i, className: 'listItems' },
      elt('div', { id: i, className: 'lists' }),
      elt('p', { id: i, className: 'listName', textContent: cnt.name })
    ) //check with id
    listContainer.appendChild(res)
  }
  divSelectorList()
  // pSelectorList()
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
      elt('p', { id: count, className: 'listName', innerText: listName })
    )
    listContainer.appendChild(res)
    list.push(res.id)
    localStorage.setItem(
      `${res.id}`,
      JSON.stringify({ id: res.id, name: listName, todos: [] })
    )
    localStorage.setItem('todo', JSON.stringify(list))
    // pSelectorList()
    divSelectorList()
  }
}
function divSelectorList() {
  const selectDiv = document.querySelectorAll('.listItems')
  for (let i of Array.from(selectDiv)) {
    i.addEventListener('mousedown', event => {
      event.preventDefault()
      if (event.button == 0) {
        openList(event)
      } else if (event.button == 2) {
        event.preventDefault()
        selectList(event)
      }
    })
    i.addEventListener('contextmenu', event => event.preventDefault())
    i.addEventListener('dblclick', renameList)
  }
}

// function pSelectorList() {
//   const selectP = document.querySelectorAll('.listName')
//   for (let i of Array.from(selectP)) {
//     i.addEventListener('mousedown', event => {
//       event.preventDefault()
//       if (event.button == 0) {
//         // deleteListButtonEnabler(event)
//         openList(event)
//       } else if (event.button == 2) {
//         event.preventDefault()
//         selectList(event)
//       }
//     })
//     i.addEventListener('contextmenu', event => event.preventDefault())
//     i.addEventListener('dblclick', renameList)
//   }
// }
function renameList(event) {
  let newName = prompt('new list name')
}

function openList(event) {
  listPage.style = 'display:none'
  taskPage.style = 'display:block'
  taskContainer.textContent = ''
  const id = event.target.id // Check with the id case
  taskFromLocalStorage(event)
  taskInput.addEventListener('keydown', event => {
    if (event.target.value && event.keyCode == '13') addTask(event, id)
  })
}

function taskFromLocalStorage(event) {
  const taskList = JSON.parse(localStorage.getItem(`${event.target.id}`))
  const lTodos = taskList.todos
  todoCount = 0
  if (lTodos) {
    for (let i of lTodos) {
      const div = elt(
        'div',
        { className: 'tasks' },
        elt(
          'div',
          { className: 'task' },
          elt('input', { type: 'checkbox', className: 'checkbox' }),
          elt('p', { className: 'taskName', textContent: i.tName })
        ),
        elt(
          'div',
          { className: 'taskFeatures' },
          elt('p', { className: 'notes', textContent: 'Notes' }),
          elt('p', { className: 'dueDate', textContent: 'Due Date' }),
          elt('textarea', { className: 'textNotes', name: 'notes' }),
          elt('input', { type: 'date', class: 'date' }),
          elt('p', { className: 'priority', textContent: 'Priority' }),
          elt(
            'select',
            { name: 'priority', className: 'prioritySelect' },
            elt('option', { value: 'none', textContent: 'None' }),
            elt('option', { value: 'low', textContent: 'Low' }),
            elt('option', { value: 'medium', textContent: 'Medium' }),
            elt('option', { value: 'high', textContent: 'High' })
          ),
          elt('button', { className: 'delete', textContent: 'Delete' })
        )
      )
      // date.className = priority.className = p.className = label.className = done.className = div.id;
      taskContainer.appendChild(div)
      todoCount = `${i.tId}`
      todoCount = Number(todoCount.slice(1))
      // div.addEventListener('click', deleteTaskButtonEnabler)
    }
  }
  // div.addEventListener("click",deleteTaskButtonEnabler)
  // pSelectorTask();
  // deleteTaskButtonEnabler()
}

function addTask(event, listId) {
  const taskName = event.target.value //required for updating in localStorage
  event.target.value = ''
  console.log(taskName)
  todoCount++
  const div = elt(
    'div',
    { className: 'tasks' },
    elt(
      'div',
      { className: 'task' },
      elt('input', { type: 'checkbox', className: 'checkbox' }),
      elt('p', { className: 'taskName', textContent: taskName })
    ),
    elt(
      'div',
      { className: 'taskFeatures' },
      elt('p', { className: 'notes', textContent: 'Notes' }),
      elt('p', { className: 'dueDate', textContent: 'Due Date' }),
      elt('textarea', { className: 'textNotes', name: 'notes' }),
      elt('input', { type: 'date', class: 'date' }),
      elt('p', { className: 'priority', textContent: 'priority' }),
      elt(
        'select',
        { name: 'priority', className: 'prioritySelect' },
        elt('option', { value: 'none', textContent: 'None' }),
        elt('option', { value: 'low', textContent: 'Low' }),
        elt('option', { value: 'medium', textContent: 'Medium' }),
        elt('option', { value: 'high', textContent: 'High' })
      ),
      elt('button', { className: 'delete', textContent: 'Delete' })
    )
  )
  // date.className = priority.className = p.className = label.className = done.className =
  //   div.id;
  taskContainer.appendChild(div)
  let list = JSON.parse(localStorage.getItem(`${listId}`))
  list['todos'].push({
    tId: div.id,
    tName: `${taskName}`,
    priority: 'none',
    date: 'No Date Set',
    notes: ''
  })
  localStorage.setItem(`${listId}`, JSON.stringify(list))
  // pSelectorTask()
  // deleteTaskButtonEnabler()
  // div.addEventListener("click", deleteTaskButtonEnabler);
}

back.addEventListener('click', backToListPage)

function backToListPage(event) {
  listPage.style = 'display:block'
  // todoBody.innerHTML = ''
  taskPage.style = 'display:none'
}
