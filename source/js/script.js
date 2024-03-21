const state = new Proxy({
    tasks: [],
    selectedTaskIds: [],
    editingTaskId: null,
    viewState: 'view',
    deleteState: false
  }, {
    set: function(target, property, value) {
        target[property] = value;
        updateTasks();
        saveToLocalStorage();
        return true;
    }
  });
  
  function viewTasks() {
    document.getElementById('viewTasksButton').style.display = "none";
    document.getElementById('createEditTaskButton').style.display = "block";
    document.getElementById('deleteTasksButton').style.display = "block";
    document.getElementById('deleteSelectedButton').style.display = "none";
    state.viewState = 'view';
    state.deleteState = false;
  }
  
  function createEditTask() {
    document.getElementById('createEditTaskButton').style.display = "none";
    document.getElementById('viewTasksButton').style.display = "block";
    state.viewState = 'edit';
    state.deleteState = false;
  }
  
  function deleteTasks() {
    state.deleteState = true;
    state.viewState = 'delete';
  }
  
  function createTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
  
    if (title !== "") {
        const newTask = { id: Date.now(), title: title, description: description };
        state.tasks.push(newTask);
        state.viewState = 'view';
        viewTasks();
    } else {
        alert('Вы не ввели название задачи!');
    }
  
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
  }
  
  function deleteTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
  }
  
  function deleteSelectedTasks() {
    state.tasks = state.tasks.filter(task => !state.selectedTaskIds.includes(task.id));
    state.selectedTaskIds = [];
  }
  
  function toggleTaskSelection(taskId) {
    if (state.deleteState) {
      if (state.selectedTaskIds.includes(taskId)) {
          state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== taskId);
      } else {
          state.selectedTaskIds.push(taskId);
      }
    }
  }
  
  function selectTask(taskId) {
    state.editingTaskId = taskId;
    state.viewState = 'edit';
  }
  
  function saveEditedTask(newTitle, newDescription) {
    const task = state.tasks.find(task => task.id === state.editingTaskId);
    if (task) {
        task.title = newTitle;
        task.description = newDescription;
        state.editingTaskId = null;
        state.viewState = 'view';
    }
    viewTasks();
  }
  
  function toggleCheckboxVisibility() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.style.display = state.deleteState ? 'block' : 'none';
    });
  }
  
  
  function updateTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
  
    state.tasks.forEach(task => {
      const li = document.createElement("li");
  
      const title = document.createElement("strong");
      title.textContent = task.title;
  
      const description = document.createElement("p");
      description.textContent = task.description;
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = 'Удалить';
      deleteButton.addEventListener('click', () => deleteTask(task.id));
  
      const editButton = document.createElement("button");
      editButton.textContent = 'Редактировать';
      editButton.addEventListener('click', () => selectTask(task.id));
  
      if (state.deleteState) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.addEventListener('change', () => toggleTaskSelection(task.id));
        checkbox.checked = state.selectedTaskIds.includes(task.id);
        li.appendChild(checkbox);
      }
  
      li.appendChild(title);
      li.appendChild(description);
  
      if (state.deleteState) {
        li.appendChild(deleteButton);
      }
  
      if (state.viewState === 'edit' && state.editingTaskId === task.id) {
        const editForm = document.createElement("div");
  
        const editTitleInput = document.createElement("input");
        editTitleInput.type = "text";
        editTitleInput.value = task.title;
  
        const editDescriptionTextarea = document.createElement("textarea");
        editDescriptionTextarea.value = task.description;
  
        const saveButton = document.createElement("button");
        saveButton.textContent = 'Сохранить';
        saveButton.addEventListener('click', () => saveEditedTask(editTitleInput.value, editDescriptionTextarea.value));
  
        editForm.appendChild(editTitleInput);
        editForm.appendChild(editDescriptionTextarea);
        editForm.appendChild(saveButton);
  
        li.appendChild(editForm);
      } else if (state.viewState === 'edit') {
        li.appendChild(editButton);
      }
  
      taskList.appendChild(li);
    });
    toggleCheckboxVisibility();
  }
  function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }
  
  function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        state.tasks = JSON.parse(savedTasks);
    }
  }
  
  document.getElementById('viewTasksButton').addEventListener('click', viewTasks);
  document.getElementById('createEditTaskButton').addEventListener('click', createEditTask);
  document.getElementById('deleteTasksButton').addEventListener('click', deleteTasks);
  document.getElementById('deleteSelectedButton').addEventListener('click', () => {
    deleteSelectedTasks();
    state.deleteState = false;
  });
  
  function showDeleteSelectedButton() {
    document.getElementById('deleteTasksButton').style.display = 'none';
    document.getElementById('deleteSelectedButton').style.display = 'block';
  }
  
  function showDeleteTasksButton() {
    document.getElementById('deleteTasksButton').style.display = 'block';
    document.getElementById('deleteSelectedButton').style.display = 'none';
  }
  
  document.getElementById('deleteTasksButton').addEventListener('click', showDeleteSelectedButton);
  document.getElementById('deleteSelectedButton').addEventListener('click', showDeleteTasksButton);
  
  loadFromLocalStorage();
  updateTasks();
  
  