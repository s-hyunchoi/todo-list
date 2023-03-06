// DOM Elements
const todoForm = document.querySelector('#todo-form');
const todoList = document.querySelector('.todos');
const remainingTasks = document.querySelector('#remaining-task');
const completedTasks = document.querySelector('#completed-tasks');
const totalTasks = document.querySelector('#total-task');
const mainInput = document.querySelector('#todo-form input');

const TASKS_KEY = "tasks"

let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];

if (localStorage.getItem(TASKS_KEY)) {
    // map()은 순환시키며 처리, forEach()와 다르게 반환값을 가진다.
    // map()은 새로운 array를 반환, forEach()는 기존의 array를 변경한다.
    tasks.map(task => {
        createTask(task);
    })
};

// InputForm에 사용자가 입력해서 제출할 때, 일어날 수 있는 일들
todoForm.addEventListener('submit', e => {
    e.preventDefault();

    const inputValue = mainInput.value;

    // inputValue 값에 아무것도 없으면, 여기서 함수를 종료한다.
    if (inputValue == '') {
        return
    };

    // inputValue == ''가 아니면, 함수를 실행한다.
    const task = {
        id : Date.now(), // new Date().getTime();, 유니크한 아이디를 얻는 방법
        name : inputValue,
        isCompleted : false,
    };

    // localStage에 저장하기
    tasks.push(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

    createTask(task);

    todoForm.reset(); // 폼 엘리먼트의 내용을 비우는 것이 아니라 페이지 로딩시의 초기값으로 돌리는 기능
    mainInput.focus(); // 폼의 요소에 포커스 주기
});

todoList.addEventListener('click', e => {
    if (e.target.classList.contains('remove-task')) {
        // closest() >> 현재의 Element에서 파라미터에 입력된 선택자에 만족할 때까지 탐색하고,
        // 가장 가까운 선택자를 들고온다. 조건에 만족하지 않는 경우 NaN을 반환함.
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

// 작성한 To do list 요소를 만들어서 화면에 보여주기
function createTask(task) {
    const taskEl = document.createElement('li');

    taskEl.setAttribute('id', task.id); // 엘리먼트에 속성 추가 element.setAttribute(속성명,속성값);

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

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length;
};

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== parseInt(taskId));

    console.log(tasks);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById(taskId).remove();
    countTasks();
};

// 상태를 업데이트 해주는 함수, todo를 완료하거나 수정하거나
function updateTask(taskId, el) {
    const task = tasks.find(task => task.id === parseInt(taskId));

    // contenteditable하면, textContent로 네임을 바꿔주고, 아닌 경우 체크박스 체크
    if (el.hasAttribute('contenteditable')) {
        task.name = el.textContent;
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        // 여기 부분 이해를 다시 해야 할 듯
        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');
        };

        localStorage.setItem('tasks', JSON.stringify(tasks));

        countTasks();
    };
};