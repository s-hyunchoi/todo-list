// DOM Element
const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-task");
const remainingTasks = document.querySelector("#remaining-task");
const completedTasks = document.querySelector("#completed-task");
const mainInput = document.querySelector("#todo-form input");

const TASKS_KEY = "tasks";

let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];

if (localStorage.getItem(TASKS_KEY)) {
    tasks.map(task => createTask(task));
};

todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const inputValue = mainInput.value;
    
    // 사용자가 빈 내용을 입력하면, 함수를 아예 종료시킨다.
    if (inputValue == '') {
        return;
    };

    const task = {
        id : Date.now(),
        name : inputValue,
        isCompleted : false, // 완료됐는지 아닌지를 볼 예정
    };

    tasks.push(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

    createTask(task);

    todoForm.reset(); // 처음 상태로 되돌려라
    mainInput.focus(); // 다시 포커스 상태로
});

todoList.addEventListener('click', e => {
    if (e.target.classList.contains('remove-task')) {
        const taskId = e.target.closest('li').id;
        removeTask(taskId);
    };
});

todoList.addEventListener('input', e => {
    const taskId = e.target.closest('li').id;
    
    updateTask(taskId, e.target);
});

todoList.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
        e.preventDefault();

        e.target.blur(); // blur() >> remove focus
    };
});

function createTask(task) {
    const taskEl = document.createElement('li');
    taskEl.setAttribute('id', task.id);

    // !!!!!!!!!!!!!!!!!!!!!!!!!
    if (task.isCompleted) {
        taskEl.classList.add('complete');
    }

    const taskElMarkup = `
        <div>
            <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
            <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
        </div>
            
        <button title="Remove the ${task.name}" class="remove-task">
            Delete
        </button>
    `;

    taskEl.innerHTML = taskElMarkup;
    todoList.appendChild(taskEl);
    countTasks();
};

function countTasks() {
    const completedTasksArray = tasks.filter(task => task.isCompleted === true);
    console.log(completedTasksArray.length)

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length;
};

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    console.log(tasks);

    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

    document.getElementById(taskId).remove();

    countTasks();
};

function updateTask(taskId, el) {
    const task = tasks.find(task => task.id === parseInt(taskId));

    if (el.hasAttribute('contenteditable')) {
        task.name = el.textContent;
    } else {
        // 체크 박스만 남은 경우의 수
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        console.log(task.isCompleted)

        if (task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');
        };

        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        countTasks();
    };
};

function updateTask(taskId, el) {
    const task = tasks.find(task => task.id === parseInt(taskId));
};