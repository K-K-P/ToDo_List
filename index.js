"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todoItem_1 = require("./todoItem");
const inquirer = require("inquirer"); // 3rd party module for prompting data from the user
const jsonTodoCollection_1 = require("./jsonTodoCollection");
let todos = [new todoItem_1.TodoItem(1, 'Buy flowers'), new todoItem_1.TodoItem(2, 'Pick up shoes'), new todoItem_1.TodoItem(3, 'Call mom'),
    new todoItem_1.TodoItem(4, 'Buy tickets', true)];
let newCollection = new jsonTodoCollection_1.JsonTodoCollection('Kamil', todos); // Changed from TodoCollection class object to JsonTodoCollection class object
let showCompleted = true;
function displayTodoList() {
    console.log(`${newCollection.userName}'s list` + `(Number of unfinished tasks: 
        ${newCollection.getItemCounts().incomplete})`);
    newCollection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Add new task";
    Commands["Toggle"] = "Show or hide completed";
    Commands["Quit"] = "End";
    Commands["Complete"] = "Task done";
    Commands["Purge"] = "Delete done tasks";
})(Commands || (Commands = {}));
function promptComplete() {
    console.clear();
    inquirer.prompt({ type: 'checkbox', name: 'complete', message: 'Marking task as done',
        choices: newCollection.getTodoItems(showCompleted).map(item => ({ name: item.task, value: item.id, checked: item.complete })) }).then(answers => {
        let completedTasks = answers['complete']; // type assertion - telling the compilator to use only 'number' data type
        newCollection.getTodoItems(true).forEach(item => newCollection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
        promptUser();
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: 'list',
        name: 'command',
        message: 'Pick option',
        choices: Object.values(Commands),
        // badProperty : true
    }).then(answers => {
        switch (answers['command']) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (newCollection.getItemCounts().incomplete > 0) {
                    promptComplete();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                newCollection.removeCompleted();
                promptUser();
                break;
        }
    });
}
function promptAdd() {
    console.clear();
    inquirer.prompt({ type: 'input', name: 'add', message: 'Provide the task:' }).then(answers => {
        if (answers['add'] !== '') {
            newCollection.addTodo(answers['add']);
        }
        promptUser();
    });
}
// console.log(`${newCollection.userName}'s list` + ` (Number of tasks to be done: 
//     ${newCollection.getItemCounts().incomplete})`);  // Previous implementation
// newCollection.addTodo(todoItem);  // error - type not assignable to parameter's type
promptUser();
// str 47
