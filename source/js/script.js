const state = new Proxy({ // Объявляем прокси-объект и помещаем в него массив с названием, описанием и айди задачи
    tasks: [
        { id: 1, title: "Приготовить обед", description: "Было бы неплохо приготовить обед сегодня утром." }
    ],
    selectedTaskIds: []
}, {
    set: function (target, property, value) { // Создаём прокси-объект
        target[property] = value;
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
    }

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
}


function renderTasks() { // Функция отображения списка созданных задач на странице
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    state.tasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

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
        li.appendChild(editButton);

        taskList.appendChild(li);
    });
}

renderTasks();


