async function addTask() {
    var taskInput = document.getElementById("task");
    var taskValue = taskInput.value;

    if (taskValue.trim() === '') return;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskName: taskValue, taskStatus: 'active' }),
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        const task = await response.json();
        addTaskToList(task);
    } 
    catch (error) {
        console.error('Error adding task:', error);
    }

    taskInput.value = "";
    filterTasks();
};

function filterTasks() {
    const filter = document.querySelector('.status .active')?.id || 'all';
    const items = document.querySelectorAll('#task-list .todo-item');

    items.forEach(item => {
        const isChecked = item.querySelector('input').checked;
        if (filter === 'all') {
            item.style.display = '';
        } 
        else if (filter === 'active') {
            item.style.display = isChecked ? 'none' : '';
        } 
        else if (filter === 'completed') {
            item.style.display = isChecked ? '' : 'none';
        }
    });
};

function addTaskToList(task) {
    const list = document.createElement("li");
    list.className = "todo-item";
    list.setAttribute("draggable", "true");
    list.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.taskStatus === "completed";

    if (checkbox.checked) {
        list.classList.add("completed");
    }
    checkbox.addEventListener("change", async function() {
        const newStatus = checkbox.checked ? 'completed' : 'active';
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskName: task.taskName, taskStatus: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            list.classList.toggle("completed");
            filterTasks();
        } 
        catch (error) {
            console.error('Error updating task:', error);
        }
    });

    list.appendChild(checkbox);

    const textWrapper = document.createElement("span");
    textWrapper.className = "task-text";
    textWrapper.textContent = task.taskName;
    list.appendChild(textWrapper);

    const editIcon = document.createElement("span");
    editIcon.className = "edit-icon";
    editIcon.textContent = "✏️";

    editIcon.addEventListener("click", async function() {
        const newTaskValue = prompt("Edit task:", task.taskName);
        if (newTaskValue !== null && newTaskValue.trim() !== '') {
            try {
                const response = await fetch(`/api/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ taskName: newTaskValue, taskStatus: checkbox.checked ? 'completed' : 'active' }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update task');
                }

                textWrapper.textContent = newTaskValue;
            } 
            catch (error) {
                console.error('Error updating task:', error);
            }
        }
    });

    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.textContent = "❌";
    deleteIcon.addEventListener("click", async function() {
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            list.remove();
            filterTasks();
        } 
        catch (error) {
            console.error('Error deleting task:', error);
        }
    });

    list.appendChild(editIcon);
    list.appendChild(deleteIcon);

    list.addEventListener("dragstart", dragStart);
    list.addEventListener("dragover", dragOver);
    list.addEventListener("drop", drop);

    const ul = document.getElementById("task-list");
    ul.appendChild(list);
};

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.status button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            fetchTasks(button.id);
        });
    });

    fetchTasks('all');
});

let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (draggedItem) {
        this.parentNode.insertBefore(draggedItem, this.nextSibling);
        updateTaskOrder();
    }
}

async function updateTaskOrder() {
    const tasks = Array.from(document.querySelectorAll('#task-list .todo-item'))
        .map((item, index) => {
            const id = parseInt(item.dataset.id, 10);
            return {
                id: isNaN(id) ? null : id,
                taskOrder: index + 1
            };
        })
        .filter(task => task.id !== null);

    console.log('Tasks array to be sent:', tasks);

    try {
        const response = await fetch('/api/tasks/order/:id', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tasks }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update task order: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Task order updated successfully:', responseData);

    } 
    catch (error) {
        console.error('Error updating task order:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('#task-list .todo-item');
    items.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', drop);
    });

    fetchTasks('all');
});

async function fetchTasks(status = 'all') {
    try {
        const response = await fetch(`/api/tasks${status !== 'all' ? `/${status}` : ''}`);
        const tasks = await response.json();

        const ul = document.getElementById("task-list");
        ul.innerHTML = '';

        tasks.sort((a, b) => a.taskOrder - b.taskOrder);

        tasks.forEach(task => {
            addTaskToList(task);
        });
    } 
    catch (error) {
        console.error('Error fetching tasks:', error);
    }
}