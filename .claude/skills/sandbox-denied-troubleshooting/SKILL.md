---
name: sandbox-denied-troubleshooting
description: Troubleshooting guide for sandbox-exec permission denials. Use when encountering "Operation not permitted" errors caused by macOS sandbox-exec policy during development.
---

# Sandbox Permission Denied Troubleshooting

Guide for resolving `Operation not permitted` errors caused by the sandbox policy at `tools/claudecode/sandbox.sb`.

## Resolution Steps

1. **Identify the denied path** from the error message.

2. **If the path is necessary for development work**, modify `tools/claudecode/sandbox.sb` to allow the path.

3. **Commit the change** to `sandbox.sb`.

4. **Ask the user to restart Claude Code** — sandbox policy changes only take effect on the next `sandbox-exec` invocation. The current session continues under the old policy.

## Important Notes

- Do NOT bypass the sandbox or remove the `(deny file-write*)` directive. The sandbox exists to protect the system.
- Only add paths that are genuinely needed for development workflows.

## Debugging Tips

The sandbox.sb file includes a `(debug deny)` directive, which logs all denied operations to the macOS system log. To monitor denials in real time:

```bash
sudo log stream --predicate 'sender == "Sandbox"' | grep deny
```
