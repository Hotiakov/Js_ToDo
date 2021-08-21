'use strict';

class ToDo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoList = document.querySelector(todoList);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }
    createToDoItem = (todoName) => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.id = todoName.key;
        li.insertAdjacentHTML("afterbegin", `<span class="text-todo">` + todoName.value + '</span> <div class="todo-buttons"> <button class="todo-edit"></button> <button class="todo-remove"></button> <button class="todo-complete"></button> </div>');
        if (todoName.completed) {
            this.todoCompleted.append(li);
        }
        else {
            this.todoList.append(li);
        }
    }

    render() {
        this.todoCompleted.textContent = '';
        this.todoList.textContent = '';
        this.todoData.forEach(this.createToDoItem);
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
        this.input.value = "";
        this.render();
    }

    deleteItem(key) {
        this.todoData.delete(key);
        this.render();
    }

    completedItem(key) {
        console.log(key);
        this.todoData.get(key).completed = !this.todoData.get(key).completed;
        this.render();
    }

    handler() {
        document.querySelector(".todo-container").addEventListener('click', (e) => {
            if (e.target.className !== "todo-remove" && e.target.className !== "todo-complete")
                return;
            const targetItem = e.target.closest("li");
            console.log(targetItem);
            if (e.target.className === "todo-remove") {
                this.deleteItem(targetItem.id);
            } else if (e.target.className === "todo-complete") {
                this.completedItem(targetItem.id);
            }
        });
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }



}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();