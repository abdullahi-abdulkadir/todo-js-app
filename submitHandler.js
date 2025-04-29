



// // named export
// export function todoSubmitHandler(event) {
//   event.preventDefault(); // Prevent the form from submitting
//   // let form = event.target;
//   // let todoValue = todoInput.value;

//   let formData = new FormData(todoForm);
//   let todoValue = formData.get("todo");
//   console.log(todoValue);
//   const todoText = document.createTextNode(todoValue.trim());
//   const todoLi = document.createElement("li");
//   const todoDeleteSpan = document.createElement("span");
//   todoDeleteSpan.classList.add("delete");
//   todoDeleteSpan.textContent = "❌";
//   todoDeleteSpan.setAttribute("title", `delete ${todoValue.trim()}`);
  


//   todoDeleteSpan.onclick = function () {
//     todoLi.remove();
//   };
 
//   todoText.dblclick = function() {
   
//     alert("cliked")
//   }
//     // todoSpan.setAttribute("contenteditable", "true")
//     // todoSpan.focus()
   
  
//   // put the text inside the li
//   todoLi.append(todoText, todoDeleteSpan);

//   // append the li to the ol
//   todosDisplay.append(todoLi);

//   // clear the form after submission - set input to empty string or form reset api
//   todoForm.reset();
//   // todoInput.value = ""

//   console.log("Form submitted!");
//   // You can perform validation or other actions here
// }

// export const PI = 22 / 7;



// load todo immediately 
// Load todos from localStorage when page loads
window.addEventListener('DOMContentLoaded', loadTodos);

// Create Clear All button
const clearAllBtn = document.createElement('button');
clearAllBtn.textContent = 'Clear All';

// Create Filter All Completed button
const filterAll = document.createElement('button');
filterAll.textContent = 'Filter All Completed Todo';
filterAll.style.marginLeft = '8px'; // Small spacing

export function todoSubmitHandler(event) {
  event.preventDefault();

  const todoInput = document.getElementById('todo');
  const inputValue = todoInput.value.trim();

  if (inputValue) {
    const todoForm = document.getElementById('todoForm');
    const todoDisplay = document.getElementById('todosDisplay');

    const todoLi = document.createElement('li');

    // Create checkbox
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.style.marginRight = '8px';

    const todoText = document.createElement('span');
    const deleteBtn = document.createElement('span');

    todoText.textContent = inputValue;
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete');

    // Append checkbox, text, and delete button into <li>
    todoLi.append(checkBox, todoText, deleteBtn);
    todoDisplay.append(todoLi);

    // Save to localStorage
    saveTodo(inputValue);

    todoForm.reset();

    // Delete one todo
    deleteBtn.addEventListener('click', () => {
      todoLi.remove();
      removeTodo(inputValue);
    });

    // Mark completed
    checkBox.addEventListener('change', () => {
      if (checkBox.checked) {
        todoText.style.textDecoration = 'line-through';
        todoText.style.color = 'gray';
      } else {
        todoText.style.textDecoration = 'none';
        todoText.style.color = 'black';
      }
    });

    // Double-click to edit
    todoText.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = todoText.textContent;
      todoLi.replaceChild(editInput, todoText);
      editInput.focus();

      editInput.addEventListener('blur', () => {
        todoText.textContent = editInput.value.trim() || 'Untitled';
        todoLi.replaceChild(todoText, editInput);
        updateTodo(inputValue, editInput.value.trim() || 'Untitled');
      });
    });
  }
}

// ===== LOCAL STORAGE HELPER FUNCTIONS =====

// Save a todo
function saveTodo(todo) {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Remove a todo
function removeTodo(todo) {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos = todos.filter(t => t !== todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Update a todo (after editing)
// let oldTodo = todoText.textContent; // Store the old todo text
// let newTodo = editInput.value.trim() || 'Untitled'; // New todo text
function updateTodo(oldTodo, newTodo) {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  const index = todos.indexOf(oldTodo);
  if (index !== -1) {
    todos[index] = newTodo;
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

// Load todos on page load
function loadTodos() {
  const todoDisplay = document.getElementById('todosDisplay');
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  todos.forEach(todoText => {
    const todoLi = document.createElement('li');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.style.marginRight = '8px';

    const todoSpan = document.createElement('span');
    const deleteBtn = document.createElement('span');

    todoSpan.textContent = todoText;
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete');

    todoLi.append(checkBox, todoSpan, deleteBtn);
    todoDisplay.append(todoLi);

    // Delete
    deleteBtn.addEventListener('click', () => {
      todoLi.remove();
      removeTodo(todoText);
    });

    // Complete
    checkBox.addEventListener('change', () => {
      if (checkBox.checked) {
        todoSpan.style.textDecoration = 'line-through';
        todoSpan.style.color = 'gray';
      } else {
        todoSpan.style.textDecoration = 'none';
        todoSpan.style.color = 'black';
      }
    });

    // Edit
    todoSpan.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = todoSpan.textContent;
      todoLi.replaceChild(editInput, todoSpan);
      editInput.focus();

      editInput.addEventListener('blur', () => {
        todoSpan.textContent = editInput.value.trim() || 'Untitled';
        todoLi.replaceChild(todoSpan, editInput);
        updateTodo(todoText, editInput.value.trim() || 'Untitled');
      });
    });
  });
}

// ====== CLEAR ALL BUTTON ======

const todoForm = document.getElementById('todoForm');
todoForm.append(clearAllBtn);

clearAllBtn.addEventListener('click', () => {
  const todoDisplay = document.getElementById('todosDisplay');
  todoDisplay.textContent = ''; // Clear all from page
  localStorage.clear();         // Clear all from storage
});

// ====== FILTER ALL COMPLETED BUTTON ======

todoForm.append(filterAll);

filterAll.addEventListener('click', () => {
  const todoDisplay = document.getElementById('todosDisplay');
  todoDisplay.querySelectorAll('li').forEach((li) => {
    const checkBox = li.querySelector('input[type="checkbox"]');
    if (checkBox && checkBox.checked) {
      li.style.display = 'flex';
    } else {
      li.style.display = 'none';
    }
  });
});


