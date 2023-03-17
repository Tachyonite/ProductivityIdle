const taskCounter = document.getElementById("taskCounter");
const taskiumCounter = document.getElementById("taskiumCounter");
const addTaskButton = document.getElementById("addTaskButton");
const newTaskInput = document.getElementById("newTask");
const taskList = document.getElementById("taskList");
const clearDataButton = document.getElementById("clearDataButton");
const exportDataButton = document.getElementById("exportDataButton");
const importDataButton = document.getElementById("importDataButton");



let count = 0;
let taskiumCount  = 0;


function animateTaskiumIncrement(currentValue, targetValue, duration) {
  const startTime = performance.now();
  const difference = targetValue - currentValue;

  function updateTaskiumValue(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const newValue = currentValue + difference * progress;
    taskiumCounter.textContent = Math.round(newValue);

    if (progress < 1) {
      requestAnimationFrame(updateTaskiumValue);
    } else {
      taskiumCount = targetValue;
      saveTasks();
    }
  }

  requestAnimationFrame(updateTaskiumValue);
}

function createTask(text, pinned = false) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task");

  const taskiumButton = document.createElement("button");
  taskiumButton.textContent = "1";
  taskiumButton.classList.add("taskium-button");
  taskItem.appendChild(taskiumButton);

  taskiumButton.addEventListener("click", () => {
  const currentValue = parseInt(taskiumButton.textContent, 10);
  let newValue;

  switch (currentValue) {
    case 1:
      newValue = 2;
      break;
    case 2:
      newValue = 5;
      break;
    case 5:
      newValue = 10;
      break;
    case 10:
    default:
      newValue = 1;
      break;
  }

  taskiumButton.textContent = newValue.toString();
  saveTasks();
});

  const taskText = document.createElement("span");
  taskText.textContent = text;
  taskItem.appendChild(taskText);

  createEditableText(taskText);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  taskItem.appendChild(buttonContainer);



  const completeButton = document.createElement("button");
  completeButton.textContent = "✔️";
  completeButton.classList.add("complete-button");
  buttonContainer.appendChild(completeButton);  

   const pinButton = document.createElement("button");
  pinButton.textContent = pinned ? "📌" : "📌";
  pinButton.classList.add("pin-button");
  buttonContainer.appendChild(pinButton);


  const deleteButton = document.createElement("button");
  deleteButton.textContent = "❌";
  deleteButton.classList.add("delete-button");
  buttonContainer.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
    taskList.removeChild(taskItem);
    saveTasks();
    });

   completeButton.addEventListener("click", () => {
    taskItem.classList.add("completed");
    setTimeout(() => {
      count++;
      const taskiumValue = parseInt(taskiumButton.textContent, 10);
        const newTaskiumCount = taskiumCount + taskiumValue;
        animateTaskiumIncrement(taskiumCount, newTaskiumCount, 1000);
      if (!taskItem.classList.contains("pinned")) {
        taskList.removeChild(taskItem);
        }
      else {
        taskItem.classList.remove("completed");
      }
      taskCounter.textContent = count;
      saveTasks();
    }, 200);
  });


  if (pinned) {
    taskItem.classList.add("pinned");
  }

  pinButton.addEventListener("click", () => {
    if (taskItem.classList.contains("pinned")) {
      taskItem.classList.remove("pinned");
      pinButton.textContent = "📌";
      taskList.appendChild(taskItem);
    } else {
      taskItem.classList.add("pinned");
      pinButton.textContent = "📌";
      taskList.insertBefore(taskItem, taskList.firstChild);
    }
    saveTasks();
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
  const storedTaskiumCount = localStorage.getItem("taskiumCount");
  if (storedTaskiumCount) {
    taskiumCount = parseInt(storedTaskiumCount, 10);
    taskiumCounter.textContent = taskiumCount;
  }
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      const taskItem = createTask(task.text, task.pinned);
      taskList.appendChild(taskItem);
    });
  }

  if (storedCount) {
    count = parseInt(storedCount, 10);
    taskCounter.textContent = count;
  }
}

function saveTasks() {
  const tasks = Array.from(taskList.children).map((task) => ({
    text: task.querySelector("span").textContent,
    pinned: task.classList.contains("pinned"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("count", count.toString());
  localStorage.setItem("taskiumCount", taskiumCount.toString());
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

function exportData() {
  const tasks = Array.from(taskList.children).map((task) => ({
    text: task.querySelector("span").textContent,
    pinned: task.classList.contains("pinned"),
  }));

  const data = {
    count,
    taskiumCount,
    tasks,
  };

  const dataString = JSON.stringify(data);
  prompt("Copy the text below to save your data:", dataString);
}

function importData() {
  const dataString = prompt("Paste the text you previously copied to import your data:");

  if (dataString) {
    try {
      const data = JSON.parse(dataString);

      if (
        data.count !== undefined &&
        data.taskiumCount !== undefined &&
        Array.isArray(data.tasks)
      ) {
        count = data.count;
        taskCounter.textContent = count;

        taskiumCount = data.taskiumCount;
        taskiumCounter.textContent = taskiumCount;

        taskList.innerHTML = "";
        data.tasks.forEach((task) => {
          const taskItem = createTask(task.text, task.pinned);
          taskList.appendChild(taskItem);
        });

        saveTasks();
      } else {
        alert("Invalid data format. Please ensure you paste the correct data.");
      }
    } catch (error) {
      alert("Error parsing data. Please ensure you paste the correct data.");
    }
  }
}

exportDataButton.addEventListener("click", exportData);
importDataButton.addEventListener("click", importData);