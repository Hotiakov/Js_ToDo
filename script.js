const todoСontrol = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoCompleted = document.querySelector('.todo-completed'),
    todoUncompleted = document.querySelector('.todo-list');
let toDoList;

if (localStorage.getItem("toDoList") === null) {
    toDoList = [];
}
else {
    toDoList = JSON.parse(localStorage.toDoList);
}


const createToDoItem = function (todoName) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.insertAdjacentHTML("afterbegin", '<span class="text-todo">' + todoName + '</span> <div class="todo-buttons"> <button class="todo-remove"></button> <button class="todo-complete"></button> </div>');
    return li;
}

const render = function () {
    todoCompleted.textContent = '';
    todoUncompleted.textContent = '';
    toDoList.forEach(function (item, index) {
        const li = createToDoItem(item.value);
        if (item.completed) {
            todoCompleted.append(li);
        }
        else {
            todoUncompleted.append(li);
        }
        li.querySelector('.todo-complete').addEventListener('click', function () {
            item.completed = !item.completed;
            render();
        });
        li.querySelector('.todo-remove').addEventListener('click', function () {
            toDoList.splice(index, 1);
            render();
        });
    });
    localStorage.clear();
    localStorage.toDoList = JSON.stringify(toDoList);
};

todoСontrol.addEventListener('submit', function (event) {
    event.preventDefault();
    if (headerInput.value === "")
        return;
    toDoList.push({
        value: headerInput.value,
        completed: false
    });
    headerInput.value = "";
    render();
});

render();