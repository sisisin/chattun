---
name: do-task
description: 'Register a task in TODO.md and execute it. Use this when the user asks you to do work, implement something, fix something, or make changes.'
argument-hint: '<description of what you want done>'
---

# Do Task

Register the user's request as a task in `docs/agents/exectasks/TODO.md` and execute it.

## Procedure

### 1. Analyze the request

Analyze $ARGUMENTS and clarify what needs to be achieved. If anything is unclear, ask the user before proceeding.

### 2. Register the task

Append a new task to the `# Tasks` section of `docs/agents/exectasks/TODO.md`, following the task list format defined in the file.

### 3. Execute

Follow the exectasks-guide in `docs/agents/exectasks/TODO.md` to execute the task.
