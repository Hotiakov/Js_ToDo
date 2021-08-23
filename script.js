'use strict';

class ToDo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoList = document.querySelector(todoList);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    start() {
        this.todoData.forEach(this.createToDoItem);
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    insertElem(elem) {
        elem.style.opacity = 0;
        if (this.todoData.get(elem.id).completed) {
            this.todoCompleted.append(elem);
        }
        else {
            this.todoList.append(elem);
        }
        let animateId,
            counter = 0;
        let animate = () => {
            animateId = requestAnimationFrame(animate);
            counter += 0.03;
            if (elem.style.opacity < 1) {
                elem.style.opacity = counter;
            }
            else {
                cancelAnimationFrame(animateId);
            }
        }
        animateId = requestAnimationFrame(animate);
    }

    createToDoItem = (todoName) => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.id = todoName.key;
        li.insertAdjacentHTML("afterbegin", `<span class="text-todo">` + todoName.value + '</span> <div class="todo-buttons"> <button class="todo-edit"></button> <button class="todo-remove"></button> <button class="todo-complete"></button> </div>');
        this.insertElem(li);
    }

    editToDoItem = (elem) => {
        const elemText = elem.querySelector('.text-todo');
        elemText.contentEditable = "true";
        elemText.focus();
        elemText.onblur = () => {
            elemText.contentEditable = "false";
            if (elemText.textContent.trim() === "") {
                elemText.textContent = this.todoData.get(elem.id).value;
            }
            else {
                elemText.textContent = elemText.textContent.trim();
                this.todoData.get(elem.id).value = elemText.textContent;
                this.render();
            }
        };
    }

    render() {
        localStorage.clear();
        this.addToStorage();
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim() === "") {
            alert("Пустые поля вводить нельзя!");
            return;
        }
        const newTodo = {
            value: this.input.value,
            completed: false,
            key: this.generateKey(),
        };
        this.todoData.set(newTodo.key, newTodo);
        this.createToDoItem(newTodo);
        this.input.value = "";
        this.render();
    }

    deleteItem(elem) {
        this.todoData.delete(elem.id);
        elem.style.opacity = 1;
        let animateId,
            counter = 1;
        const animate = () => {
            animateId = requestAnimationFrame(animate);
            counter -= 0.03;
            if (elem.style.opacity > 0) {
                elem.style.opacity = counter;
            }
            else {
                cancelAnimationFrame(animateId);
                elem.remove();
            }
        }
        animateId = requestAnimationFrame(animate);
    }

    completedItem(elem) {
        const newElem = Object.assign({}, this.todoData.get(elem.id));
        newElem.completed = !newElem.completed;
        this.deleteItem(elem);
        this.todoData.set(newElem.key, newElem);
        this.createToDoItem(newElem);
    }

    handler() {
        document.querySelector(".todo-container").addEventListener('click', (e) => {
            if (e.target.className !== "todo-remove"
                && e.target.className !== "todo-complete"
                && e.target.className !== "todo-edit") {
                return;
            }
            const targetItem = e.target.closest("li");
            if (e.target.className === "todo-remove") {
                this.deleteItem(targetItem);
            } else if (e.target.className === "todo-complete") {
                this.completedItem(targetItem);
            } else {
                this.editToDoItem(targetItem);
            }
            this.render();
        });
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.start();
        this.handler();
    }



}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();