const taskCounter = document.getElementById("taskCounter");
const addTaskButton = document.getElementById("addTaskButton");
const newTaskInput = document.getElementById("newTask");
const taskList = document.getElementById("taskList");
const clearDataButton = document.getElementById("clearDataButton");

let count = 0;

function createTask(text) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task");

  const taskText = document.createElement("span");
  taskText.textContent = text;
  taskItem.appendChild(taskText);

  createEditableText(taskText);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  taskItem.appendChild(buttonContainer);

  const completeButton = document.createElement("button");
  completeButton.textContent = "Complete";
  completeButton.classList.add("complete-button");
  buttonContainer.appendChild(completeButton);  

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("delete-button");
  buttonContainer.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
    taskList.removeChild(taskItem);
    saveTasks();
    });

   completeButton.addEventListener("click", () => {
    taskItem.classList.add("completed");
    setTimeout(() => {
      taskList.removeChild(taskItem);
      count++;
      taskCounter.textContent = count;
      saveTasks();
    }, 1000);
  });

  return taskItem;
}

function createEditableText(taskText) {
  taskText.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.classList.add("edit-task-input");

    taskText.parentElement.replaceChild(input, taskText);

    input.addEventListener("blur", () => {
      if (input.value.trim()) {
        taskText.textContent = input.value.trim();
        input.parentElement.replaceChild(taskText, input);
      } else {
        input.parentElement.replaceChild(taskText, input);
      }
      saveTasks();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      }
    });

    input.focus();
  });
}

addTaskButton.addEventListener("click", () => {
  const newTask = newTaskInput.value.trim();

  if (newTask) {
    const taskItem = createTask(newTask);
    taskList.appendChild(taskItem);
    newTaskInput.value = "";
  }
});

newTaskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTaskButton.click();
  }
});


function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  const storedCount = localStorage.getItem("count");

  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      const taskItem = createTask(task);
      taskList.appendChild(taskItem);
    });
  }

  if (storedCount) {
    count = parseInt(storedCount, 10);
    taskCounter.textContent = count;
  }
}

function saveTasks() {
  const tasks = Array.from(taskList.children).map((task) => task.querySelector("span").textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("count", count);
}

addTaskButton.addEventListener("click", () => {
  // ...
  saveTasks();
});

loadTasks();

function clearData() {
  localStorage.removeItem("tasks");
  localStorage.removeItem("count");
  taskList.innerHTML = "";
  count = 0;
  taskCounter.textContent = count;
}

clearDataButton.addEventListener("click", () => {
  const confirmClear = confirm("Are you sure you want to clear all data?");

  if (confirmClear) {
    clearData();
  }
});