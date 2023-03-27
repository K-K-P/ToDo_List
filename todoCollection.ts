import { TodoItem } from "./todoItem";

type ItemCounts = {
    total: number,
    incomplete: number
}

export class TodoCollection {
    private nextID: number = 1;
    protected itemMap = new Map<number, TodoItem>();  // <> - placing types of key, value pair  // changed private to protected - accessible only for class and its subclasses

    constructor(public userName: string, public todoItems: TodoItem[] = []){
        todoItems.forEach(item => this.itemMap.set(item.id, item));
    }
    addTodo(task: string): number {
        while (this.getTodoById(this.nextID)) {
            this.nextID++;
        }
        this.itemMap.set(this.nextID, new TodoItem(this.nextID, task));
        return this.nextID;
    }
    getTodoById(id: number): TodoItem {
        return this.itemMap.get(id);
    }

    getTodoItems(includeComplete: boolean): TodoItem[] {
        return [...this.itemMap.values()]  // ... is a JS operator for table creation
        .filter(item => includeComplete || !item.complete);
    }
    markComplete(id: number, complete: boolean) {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete
        }
    }
    removeCompleted(){
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.id)
            }
        })
    }
    getItemCounts(): ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
}
// str 47 