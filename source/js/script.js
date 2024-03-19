const state = new Proxy({ // Объявляем прокси-объект и помещаем в него массив с названием, описанием и айди задачи
    tasks: [
        { id: 1, title: "Приготовить обед", description: "Было бы неплохо приготовить обед сегодня утром." }
    ],
    selectedTaskIds: []
}, {
    set: function (target, property, value) { // Создаём прокси-объект
        target[property] = value;
        renderTasks(); // Обновляем список задач
        return true;
    }
});

function createTask() { // Функция создания задачи по клику на кнопку
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;

    if (title !== "") {
        const newTask = { id: Date.now(), title: title, description: description };
        state.tasks.push(newTask);
        renderTasks(); // Обновляем список задач после добавления новой задачи
    } else {
        alert('Вы не ввели название задачи!');
    }

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
}

function toggleTaskSelection(taskId) { // Функция переключения выбора задач
    if (state.selectedTaskIds.includes(taskId)) {
        state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== taskId);
    } else {
        state.selectedTaskIds.push(taskId);
    }
}

let editingTaskId = null;

function selectTask(taskId) { // Функция управления редактированием задачи
    editingTaskId = taskId;
    renderTasks();
}

function saveEditedTask(newTitle, newDescription) { // Функция сохранения отредактированной задачи
    const task = state.tasks.find(task => task.id === editingTaskId);
    if (task) {
        task.title = newTitle;
        task.description = newDescription;
        editingTaskId = null;
        renderTasks();
    }
}

function renderTasks() { // Функция отображения списка задач на странице
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    state.tasks.forEach(task => { // Создаём html элементы в списке
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener('change', () => toggleTaskSelection(task.id));
        checkbox.checked = state.selectedTaskIds.includes(task.id);

        const title = document.createElement("strong");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description;

        const editButton = document.createElement("button");
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', () => selectTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(title);
        li.appendChild(description);

        if (task.id === editingTaskId) { // Условие сохранения задачи в режиме редактирования
            const editForm = document.createElement("div");

            const editTitleInput = document.createElement("input");
            editTitleInput.type = "text";
            editTitleInput.value = task.title;

            const editDescriptionTextarea = document.createElement("textarea");
            editDescriptionTextarea.value = task.description;

            const saveButton = document.createElement("button");
            saveButton.textContent = 'Сохранить';
            saveButton.addEventListener('click', () => saveEditedTask(editTitleInput.value, editDescriptionTextarea.value));

            editButton.style.display = "none"; // Скрыть кнопку "Редактировать"

            editForm.appendChild(editTitleInput);
            editForm.appendChild(editDescriptionTextarea);
            editForm.appendChild(saveButton);

            li.appendChild(editForm);
        } else {
            li.appendChild(editButton);
        }

        taskList.appendChild(li);
    });
}

renderTasks();


