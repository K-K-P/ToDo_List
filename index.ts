import { TodoItem } from "./todoItem";
import { TodoCollection } from "./todoCollection";
import * as inquirer from 'inquirer';  // 3rd party module for prompting data from the user
import { JsonTodoCollection} from './jsonTodoCollection'

let todos: TodoItem[] = [new TodoItem(1, 'Buy flowers'), new TodoItem(2, 'Pick up shoes'), new TodoItem(3, 'Call mom'),
    new TodoItem(4, 'Buy tickets', true)];

let newCollection: TodoCollection = new JsonTodoCollection('Kamil', todos);  // Changed from TodoCollection class object to JsonTodoCollection class object
let showCompleted: boolean = true;

function displayTodoList(): void {
    console.log(`${newCollection.userName}'s list` + `(Number of unfinished tasks: 
        ${newCollection.getItemCounts().incomplete})`);
        newCollection.getTodoItems(showCompleted).forEach(item => item.printDetails());

    }
enum Commands {
    Add = 'Add new task',
    Toggle = 'Show or hide completed',
    Quit = 'End',
    Complete = 'Task done',
    Purge = 'Delete done tasks'
}

function promptComplete(): void {
    console.clear();
    inquirer.prompt({type: 'checkbox', name: 'complete', message: 'Marking task as done',
choices: newCollection.getTodoItems(showCompleted).map(item => ({name: item.task, value: item.id, checked: item.complete}))}).then(answers => {
    let completedTasks = answers['complete'] as number[];  // type assertion - telling the compilator to use only 'number' data type
    newCollection.getTodoItems(true).forEach(item => newCollection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
    promptUser()
})
}

function promptUser(): void {
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
        })
}

function promptAdd(): void {
    console.clear();
    inquirer.prompt({type: 'input', name: 'add', message: 'Provide the task:'}).then(answers => {if (answers['add'] !== ''){
        newCollection.addTodo(answers['add']);
    }
promptUser();
})
}


// console.log(`${newCollection.userName}'s list` + ` (Number of tasks to be done: 
//     ${newCollection.getItemCounts().incomplete})`);  // Previous implementation


// newCollection.addTodo(todoItem);  // error - type not assignable to parameter's type

promptUser();

// str 47