export default class Task {
  #tasks = new Set();

  save({ name, dueAt, fn }) {
    console.log(
      `Task ${name} saved! Will be executed at ${dueAt.toISOString()}`
    );

    this.#tasks.add({ name, dueAt, fn });
  }

  run(everyMs) {
    const intervalId = setInterval(() => {
      const now = new Date();

      for (const task of this.#tasks) {
        if (task.dueAt <= now) {
          task.fn();
          this.#tasks.delete(task);
        }
      }

      if (this.#tasks.size === 0) {
        console.log("All tasks executed!");
        clearInterval(intervalId);
        return;
      }
    }, everyMs);
  }
}
