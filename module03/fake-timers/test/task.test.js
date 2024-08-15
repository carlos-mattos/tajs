import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import Task from "../src/task";
import { setTimeout } from "node:timers/promises";

describe("Task suite", () => {
  let _logMock;
  let _task;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation();

    _task = new Task();
  });

  it.skip("should only run tasks that are due without fake timers (slow)", async () => {
    const tasks = [
      {
        name: "task will run in 5 secs",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "task will run in 10 secs",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];

    _task.save(tasks[0]);
    _task.save(tasks[1]);

    _task.run(200);

    await setTimeout(11000);

    expect(tasks[0].fn).toHaveBeenCalledTimes(1);
    expect(tasks[1].fn).toHaveBeenCalledTimes(1);
  }, 15000);

  it("should only run tasks that are due with fake timers (fast)", async () => {
    jest.useFakeTimers();

    const tasks = [
      {
        name: "task will run in 5 secs",
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn(),
      },
      {
        name: "task will run in 10 secs",
        dueAt: new Date(Date.now() + 10000),
        fn: jest.fn(),
      },
    ];

    _task.save(tasks[0]);
    _task.save(tasks[1]);

    _task.run(200);

    jest.advanceTimersByTime(4000);

    expect(tasks[0].fn).not.toHaveBeenCalledTimes(1);
    expect(tasks[1].fn).not.toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2000);

    expect(tasks[0].fn).toHaveBeenCalledTimes(1);
    expect(tasks[1].fn).not.toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(4000);

    expect(tasks[0].fn).toHaveBeenCalledTimes(1);
    expect(tasks[1].fn).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
