# Claude Code MCP Integration

## Setup Steps

1. **Copy MCP Configuration**
   ```bash
   # Copy the MCP config to Claude Code settings
   mkdir -p ~/.config/claude-code/mcp/
   cp .mcp/config.json ~/.config/claude-code/mcp/sparq-connection.json
   ```

2. **Configure Environment Variables**
   - Ensure all environment variables from `.env.local` are available to Claude Code
   - Test MCP server connectivity

3. **Verify Integration**
   ```bash
   # Test MCP servers
   npm run mcp:test
   ```

## Usage in Claude Code

### Relationship Context Queries
Ask Claude Code to use Context7 MCP for relationship pattern analysis:
- "Analyze communication patterns for couple_123 over the last 30 days"
- "Generate personalized questions based on attachment styles"

### Database Operations  
Use Supabase MCP for enhanced database operations:
- "Query user psychology profiles with RLS enforcement"
- "Set up real-time subscriptions for couple synchronization"

### Testing Automation
Use Puppeteer MCP for comprehensive testing:
- "Test the crisis intervention flow end-to-end"
- "Validate PWA installation on mobile devices"

### Subscription Management
Use Stripe MCP for premium features:
- "Create a premium subscription for a couple"
- "Handle failed payment scenarios"

## Security Best Practices

- Never commit API keys to version control
- Use environment-specific configurations
- Monitor MCP server access logs
- Regularly rotate API keys
