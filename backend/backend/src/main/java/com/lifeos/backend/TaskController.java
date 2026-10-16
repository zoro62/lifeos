package com.lifeos.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final List<Task> tasks = new ArrayList<>();

    @GetMapping
    public List<Task> getTasks() {
        return tasks;
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        task.id = UUID.randomUUID().toString();
        tasks.add(task);
        return task;
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) {
        tasks.removeIf(t -> t.id.equals(id));
    }    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task updatedTask) {
        for (Task t : tasks) {
            if (t.id.equals(id)) {
                t.title = updatedTask.title;
                t.done = updatedTask.done;
                return t;
            }
        }
        return null;
    }
}