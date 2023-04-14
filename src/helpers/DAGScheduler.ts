interface Task {
    id: string;
    dependencies: string[];
    run: () => Promise<void>;
}

import Lock from 'async-lock';

class TaskQueue {
    private tasks: Map<string, Task> = new Map();
    private readonly concurrency: number;
    private readonly dependencies: Map<string, Set<string>>;

    constructor(concurrency: number) {
        this.concurrency = concurrency;
        this.dependencies = new Map();
    }

    addTask(task: Task): void {
        if (this.tasks.has(task.id)) {
            throw new Error(`Task '${task.id}' already exists.`);
        }
        this.tasks.set(task.id, task);
        this.dependencies.set(task.id, new Set(task.dependencies));
        for (const depId of task.dependencies) {
            if (!this.tasks.has(depId)) {
                throw new Error(`Task '${task.id}' depends on non-existent task '${depId}'.`);
            }
            const deps = this.dependencies.get(depId);
            if (!deps) {
                throw new Error(`Task '${depId}' has no dependencies.`);
            }
            deps.add(task.id);
        }
    }

    async run(): Promise<void> {
        const sortedTasks = this.topologicalSort();
        const lock = new Lock();
        await Promise.allSettled(sortedTasks.map((task) => {
            return lock.acquire(task.id, async () => {
                await this.runTask(task);
            });
        }));
    }

    private topologicalSort(): Task[] {
        const sorted: Task[] = [];
        const visited: Set<string> = new Set();
        const visit = (id: string) => {
            if (visited.has(id)) {
                return;
            }
            visited.add(id);
            for (const depId of this.dependencies.get(id) || []) {
                visit(depId);
            }
            sorted.push(this.tasks.get(id)!);
        };
        for (const id of this.tasks.keys()) {
            visit(id);
        }
        return sorted.reverse();
    }

    private async runTask(task: Task): Promise<void> {
        const deps = Array.from(this.dependencies.get(task.id) || []);
        await Promise.all(deps.map((depId) => this.runTask(this.tasks.get(depId)!)));
        await task.run();
    }
}

class DAGScheduler {
    private readonly tasks: Map<string, Task>;
    private readonly completed: Set<string>;
    private readonly taskQueue: TaskQueue;

    constructor(concurrency: number) {
        this.tasks = new Map();
        this.completed = new Set();
        this.taskQueue = new TaskQueue(concurrency);
    }

    addTask(task: Task): void {
        if (this.tasks.has(task.id)) {
            throw new Error(`Task '${task.id}' already exists.`);
        }
        this.tasks.set(task.id, task);
    }

    async run(): Promise<void> {
        for (const task of this.tasks.values()) {
            if (this.completed.has(task.id)) {
                continue;
            }
            await this.runTask(task);
        }
    }

    private async runTask(task: Task): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (this.completed.has(task.id)) {
                resolve();
                return;
            }
            if (task.dependencies.length > 0) {
                try {
                    await Promise.all(task.dependencies.map((depId) => {
                        const dep = this.tasks.get(depId);
                        if (!dep) {
                            throw new Error(`Task '${task.id}' depends on non-existent task '${depId}'.`);
                        }
                        return this.runTask(dep);
                    }));
                } catch (error) {
                    reject(error);
                    return;
                }
            }
            try {
                await this.taskQueue.addTask(task);
                await this.taskQueue.run();
                this.completed.add(task.id);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

}
