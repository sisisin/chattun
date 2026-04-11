---
name: shell-scripting
description: Shell script development standards and best practices - script headers, error handling, option parsing, and common patterns. Use when planning or implementing shell scripts.
---

# Shell Script Development Guide

Shell script development practices and standards used in the KWDP project.

## Overview

Shell scripts are used for:

- Local development automation
- CI/CD workflows
- Environment setup and configuration
- Git workflow automation

## Development Standards

### Function Structure

```bash
#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

function usage() {
    cat <<EOF
Usage: $0 [OPTIONS] <arguments>

Description of what the script does.

Arguments:
  arg1    Description of argument 1

Options:
  -h, --help       Show this help message
  -d, --dry-run    Show what would be done without executing
EOF
}

function main() {
    # Implementation here
}

# Call main function with all arguments
main "$@"
```

### Error Handling

```bash
# Check prerequisites
if ! command -v required_command &> /dev/null; then
    echo "Error: required_command is not installed" >&2
    exit 1
fi

# Validate arguments
if [[ -z "${1:-}" ]]; then
    echo "Error: Argument required" >&2
    usage
    exit 1
fi

# Handle errors gracefully
if ! some_command; then
    echo "Error: Failed to execute some_command" >&2
    exit 1
fi
```

### Option Parsing

**Argument Format Standards:**

- Use `--flag='value'` format for all arguments
- Avoid positional arguments when possible
- For multiple values, use comma-separated format (e.g., `--env='dev,stg'`)

```bash
# Default values
DRY_RUN=false
VERBOSE=false
TARGET=""
ENVIRONMENTS=""

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        --target=*)
            TARGET="${1#*=}"
            shift
            ;;
        --env=*)
            ENVIRONMENTS="${1#*=}"
            shift
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage
            exit 1
            ;;
    esac
done
```

## Best Practices

1. **Quote Variables**: Always quote to prevent word splitting

   ```bash
   echo "Processing file: $filename"
   ```

2. **Use Arrays for Lists**:

   ```bash
   ENVIRONMENTS=("dev" "stg" "prd")
   for env in "${ENVIRONMENTS[@]}"; do
       echo "Processing $env"
   done
   ```

3. **Provide Dry-Run Mode**:

   ```bash
   if [[ "$DRY_RUN" == "true" ]]; then
       echo "[DRY RUN] Would execute: $command"
   else
       $command
   fi
   ```

4. **Use Descriptive Variable Names**:
   ```bash
   WORKFLOW_TYPE="daily"
   TERRAFORM_OUTPUT_DIR="/path/to/terraform"
   ```

## Common Patterns

### Confirmation Prompts

```bash
if [[ "$NO_CONFIRM" == "false" ]]; then
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi
```

### Progress Indication

```bash
echo "Starting process..."
for item in "${items[@]}"; do
    echo "Processing $item..."
    if process_item "$item"; then
        echo "  ✓ Success"
    else
        echo "  ✗ Failed" >&2
    fi
done
echo "Done."
```

## Testing Scripts

### Manual Testing

1. Test with dry-run first
2. Test error cases
3. Test in clean environment

### Automated Testing

For complex scripts:

- Create test fixtures
- Use bash testing frameworks (bats)
- Add CI tests for critical scripts

## Security Considerations

1. Never hardcode secrets - use environment variables or secret management
2. Validate input - always validate user input and file paths
3. Use absolute paths - avoid path traversal vulnerabilities
4. Set appropriate permissions - use `chmod 755` for executable scripts
