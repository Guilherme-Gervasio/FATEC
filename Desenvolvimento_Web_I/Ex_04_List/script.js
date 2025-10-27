const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const addBtn = document.getElementById("addBtn");
const columns = document.querySelectorAll(".kanban-column");

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  if (!text) return;

  const task = createTaskElement(text);
  document.getElementById(category).appendChild(task);

  taskInput.value = "";
  taskInput.focus();
}

function createTaskElement(text) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.draggable = true;

  const span = document.createElement("span");
  span.textContent = text;

  // 🔽 Novo seletor de categoria dentro da tarefa
  const moveSelect = document.createElement("select");
  moveSelect.classList.add("category-select");
  moveSelect.innerHTML = `
        <option value="todo">A Fazer</option>
        <option value="progress">Em Progresso</option>
        <option value="done">Concluído</option>
      `;
  moveSelect.addEventListener("change", (e) => {
    const newCategory = e.target.value;
    document.getElementById(newCategory).appendChild(div);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    div.remove();
  });

  div.appendChild(span);
  div.appendChild(moveSelect);
  div.appendChild(deleteBtn);

  div.addEventListener("click", (e) => {
    if (e.target.tagName !== "SELECT") {
      div.classList.toggle("completed");
    }
  });

  div.addEventListener("dragstart", () => div.classList.add("dragging"));
  div.addEventListener("dragend", () => div.classList.remove("dragging"));

  return div;
}

columns.forEach((col) => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
    col.classList.add("drag-over");
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("drag-over");
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    col.classList.remove("drag-over");
    if (draggingTask) col.appendChild(draggingTask);
  });
});
