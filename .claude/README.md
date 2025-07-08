# Claude Code Hooks for Sparq Connection

This directory contains Claude Code hooks configuration and scripts to automate development workflows for the Sparq Connection project.

## Overview

Claude Code hooks are shell commands that execute at specific lifecycle events to customize and extend Claude Code's behavior. They help maintain code quality, security, and consistency across the project.

## Hook Events

Our configuration uses the following hook events:

- **PostToolUse**: Runs after Claude successfully uses a tool (Write, Edit, MultiEdit)
- **PreToolUse**: Runs before Claude uses certain tools (especially git commits)
- **Notification**: Runs when Claude sends notifications
- **Stop**: Runs when Claude finishes responding

## Configured Hooks

### 1. Format and Lint Hook (`format-and-lint.sh`)
- **Trigger**: After file modifications
- **Purpose**: Automatically formats code with Prettier and fixes linting issues with ESLint
- **Files**: TypeScript, JavaScript, JSX, TSX, JSON files
- **Commands**: `npm run format` and `npm run lint:fix`

### 2. TypeScript Type Check Hook (`type-check.sh`)
- **Trigger**: After TypeScript file modifications
- **Purpose**: Ensures type safety by running TypeScript compiler checks
- **Files**: TypeScript (.ts, .tsx) files
- **Commands**: `npm run typecheck`

### 3. Test Runner Hook (`test-runner.sh`)
- **Trigger**: After modifications to testable files
- **Purpose**: Runs relevant tests to ensure functionality
- **Files**: Source files and test files
- **Commands**: Targeted test commands based on modified files

### 4. Build Check Hook (`build-check.sh`)
- **Trigger**: Before git commits and other critical operations
- **Purpose**: Ensures the project builds successfully before commits
- **Commands**: `npm run build`, `npm run typecheck`, `npm run lint`

### 5. Security Scan Hook (`security-scan.sh`)
- **Trigger**: After file modifications, especially security-sensitive files
- **Purpose**: Scans for potential security issues and ensures crisis detection is working
- **Checks**: 
  - Hardcoded secrets/passwords
  - API key exposure
  - Crisis detection patterns
  - Encryption usage
  - Environment file security

## File Structure

```
.claude/
├── settings.json           # Main hook configuration
├── settings.local.json     # Personal preferences (not committed)
├── README.md              # This documentation
└── hooks/
    ├── format-and-lint.sh    # Code formatting and linting
    ├── type-check.sh         # TypeScript type checking
    ├── test-runner.sh        # Test execution
    ├── build-check.sh        # Build validation
    └── security-scan.sh      # Security scanning
```

## Configuration Files

### `settings.json`
Main configuration file that defines hook behavior for the entire project team.

### `settings.local.json`
Personal preferences and overrides. This file should NOT be committed to version control.

## Security Features

Given Sparq Connection's focus on relationship safety and crisis detection, our hooks include:

- **Crisis Pattern Detection**: Scans for proper implementation of crisis detection features
- **Encryption Validation**: Ensures encryption is properly implemented for private reflections
- **API Key Security**: Prevents accidental exposure of sensitive API keys
- **Environment File Monitoring**: Warns about environment files that might be committed

## Usage

### Automatic Usage
Hooks run automatically when Claude Code performs file operations. No manual intervention required.

### Manual Testing
To test hooks manually:

```bash
# Test format and lint hook
./.claude/hooks/format-and-lint.sh "src/components/ui/Button.tsx"

# Test type check hook
./.claude/hooks/type-check.sh "src/lib/ai/openai.ts"

# Test security scan hook
./.claude/hooks/security-scan.sh "src/lib/security/encryption.ts"

# Test build check hook
./.claude/hooks/build-check.sh
```

### Debugging
To debug hook execution:

```bash
# Run Claude Code with debug output
claude --debug

# Check hook logs
tail -f /Users/chrisouimet/Sparq\ Connection/.claude/notifications.log
```

## Customization

### Adding New Hooks
1. Create a new script in the `hooks/` directory
2. Make it executable: `chmod +x hooks/your-hook.sh`
3. Add configuration to `settings.json`
4. Test the hook manually before using

### Modifying Existing Hooks
1. Edit the relevant script in `hooks/` directory
2. Test changes manually
3. Update this documentation if needed

### Personal Overrides
Use `settings.local.json` for personal preferences without affecting the team configuration.

## Best Practices

1. **Keep hooks fast**: Hooks should complete quickly to avoid slowing down development
2. **Fail gracefully**: Hooks should handle errors gracefully and provide helpful output
3. **Be specific**: Use matchers to target specific file types or operations
4. **Test thoroughly**: Always test hooks manually before deploying
5. **Document changes**: Update this README when adding or modifying hooks

## Troubleshooting

### Hook Not Running
- Check if the hook script is executable: `ls -la .claude/hooks/`
- Verify the matcher pattern in `settings.json`
- Run with `claude --debug` to see detailed output

### Permission Errors
- Ensure proper file permissions on hook scripts
- Check the `permissions` section in `settings.json`

### Script Errors
- Test the hook script manually to identify issues
- Check the script's output for error messages
- Verify all required npm scripts exist in `package.json`

## Environment Variables

The hooks use these environment variables:

- `CLAUDE_FILE_PATHS`: Paths of files modified by Claude
- `CLAUDE_TOOL_NAME`: Name of the tool being used
- `CLAUDE_COMMAND`: Command being executed
- `CLAUDE_NOTIFICATION`: Notification content
- `SPARQ_HOOKS_ENABLED`: Enable/disable Sparq-specific hooks

## Integration with Sparq Connection

These hooks are specifically designed for the Sparq Connection project and include:

- **Crisis Detection Validation**: Ensures crisis detection systems are properly implemented
- **Relationship Safety**: Validates that safety-critical code is properly reviewed
- **Privacy Protection**: Checks for proper encryption and data handling
- **Production Readiness**: Ensures code meets production quality standards

## Contributing

When contributing to the hooks system:

1. Follow the existing pattern for new hooks
2. Include proper error handling and logging
3. Test with various file types and scenarios
4. Update documentation
5. Consider security implications for relationship data

## Support

For issues with hooks:

1. Check this documentation first
2. Test hooks manually to isolate issues
3. Review Claude Code documentation at https://docs.anthropic.com/claude-code
4. File issues in the project repository

---

*This hooks system helps maintain the high quality and security standards required for Sparq Connection's relationship intelligence platform.*