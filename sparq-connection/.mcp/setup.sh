#!/bin/bash

# MCP Server Setup Script for Sparq Connection
# This script installs and configures all MCP servers for the relationship intelligence platform
# Enhanced with Color Therapy for Positive Installation Experience

set -e

# Color Therapy Palette - Installation & Setup Energy
SETUP_BLUE="\033[38;5;39m"       # Bright blue for setup energy
INSTALL_GREEN="\033[38;5;46m"    # Success green for installations
PROGRESS_PURPLE="\033[38;5;141m" # Purple for progress indication
WISDOM_GOLD="\033[38;5;220m"     # Gold for important information
ENERGY_ORANGE="\033[38;5;214m"   # Orange for active processes
CALM_CYAN="\033[38;5;87m"        # Cyan for calm guidance
POWER_RED="\033[38;5;196m"       # Red for critical notices
RESET="\033[0m"
BOLD="\033[1m"
SHINE="\033[5m"

# Environment detection
ENVIRONMENT=${NODE_ENV:-development}

echo -e "${SETUP_BLUE}${BOLD}${SHINE}🚀 Sparq Connection MCP Setup Ritual${RESET}"
echo -e "${WISDOM_GOLD}${BOLD}✨ Preparing to install Model Context Protocol servers${RESET}"
echo -e "${CALM_CYAN}${BOLD}🌟 Environment: ${ENVIRONMENT}${RESET}"
echo ""

# Check Node.js and npm
echo -e "${PROGRESS_PURPLE}${BOLD}🔍 Checking Prerequisites${RESET}"
if ! command -v node &> /dev/null; then
    echo -e "${POWER_RED}${BOLD}❌ Node.js not found${RESET}"
    echo -e "${WISDOM_GOLD}💡 Please install Node.js from https://nodejs.org/${RESET}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${POWER_RED}${BOLD}❌ npm not found${RESET}"
    echo -e "${WISDOM_GOLD}💡 Please install npm with Node.js${RESET}"
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo -e "${INSTALL_GREEN}${BOLD}✅ Node.js ${NODE_VERSION} detected${RESET}"
echo -e "${INSTALL_GREEN}${BOLD}✅ npm ${NPM_VERSION} detected${RESET}"
echo ""

# Function to install MCP server
install_mcp_server() {
    local server_name="$1"
    local package_name="$2"
    local description="$3"
    
    echo -e "${ENERGY_ORANGE}${BOLD}📦 Installing ${server_name}${RESET}"
    echo -e "${CALM_CYAN}   ${description}${RESET}"
    
    if npm list -g "$package_name" &> /dev/null; then
        echo -e "${INSTALL_GREEN}${BOLD}   ✅ ${server_name} already installed globally${RESET}"
    else
        echo -e "${PROGRESS_PURPLE}   🔄 Installing ${package_name}...${RESET}"
        if npm install -g "$package_name" &> /dev/null; then
            echo -e "${INSTALL_GREEN}${BOLD}   ✅ ${server_name} installed successfully${RESET}"
        else
            echo -e "${POWER_RED}${BOLD}   ❌ Failed to install ${server_name}${RESET}"
            echo -e "${WISDOM_GOLD}   💡 Trying local installation...${RESET}"
            if npx "$package_name" --help &> /dev/null; then
                echo -e "${INSTALL_GREEN}${BOLD}   ✅ ${server_name} available via npx${RESET}"
            else
                echo -e "${POWER_RED}${BOLD}   ❌ ${server_name} installation failed${RESET}"
                return 1
            fi
        fi
    fi
    echo ""
    return 0
}

# Install MCP servers based on environment
echo -e "${SETUP_BLUE}${BOLD}🌈 Installing MCP Servers for ${ENVIRONMENT} environment${RESET}"
echo ""

# Core servers (available in all environments)
echo -e "${WISDOM_GOLD}${BOLD}🎯 Installing Core MCP Servers${RESET}"

install_mcp_server \
    "PostgreSQL MCP" \
    "@modelcontextprotocol/server-postgres" \
    "Advanced database operations and schema management"

install_mcp_server \
    "Sequential Thinking MCP" \
    "@modelcontextprotocol/server-sequential-thinking" \
    "Enhanced AI reasoning for relationship guidance"

# Development and Testing specific servers
if [[ "$ENVIRONMENT" == "development" || "$ENVIRONMENT" == "testing" || "$ENVIRONMENT" == "staging" ]]; then
    echo -e "${WISDOM_GOLD}${BOLD}🧪 Installing Testing & Development MCP Servers${RESET}"
    
    install_mcp_server \
        "Puppeteer MCP" \
        "puppeteer-mcp-server" \
        "Automated testing of critical user journeys"
fi

# Production-like environment servers
if [[ "$ENVIRONMENT" == "staging" || "$ENVIRONMENT" == "production" ]]; then
    echo -e "${WISDOM_GOLD}${BOLD}🌍 Installing Production MCP Servers${RESET}"
    
    install_mcp_server \
        "Google Maps MCP" \
        "@modelcontextprotocol/server-google-maps" \
        "Location-based crisis resources and therapist finder"
    
    install_mcp_server \
        "Brave Search MCP" \
        "@modelcontextprotocol/server-brave-search" \
        "Finding relationship experts and therapy resources"
fi

# Create environment-specific configuration
echo -e "${PROGRESS_PURPLE}${BOLD}⚙️  Creating Environment Configuration${RESET}"

CONFIG_FILE=".mcp/config.${ENVIRONMENT}.json"
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo -e "${ENERGY_ORANGE}📄 Creating ${CONFIG_FILE}${RESET}"
    
    cat > "$CONFIG_FILE" << EOF
{
  "environment": "${ENVIRONMENT}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "mcpServers": {
    "activeServers": [
      "postgresql",
      "sequential-thinking"
$(if [[ "$ENVIRONMENT" != "production" ]]; then echo '      ,"puppeteer"'; fi)
$(if [[ "$ENVIRONMENT" == "staging" || "$ENVIRONMENT" == "production" ]]; then echo '      ,"google-maps"'; echo '      ,"brave-search"'; fi)
    ],
    "logLevel": "$(if [[ "$ENVIRONMENT" == "development" ]]; then echo "debug"; elif [[ "$ENVIRONMENT" == "testing" ]]; then echo "info"; else echo "warn"; fi)",
    "testMode": $(if [[ "$ENVIRONMENT" == "development" || "$ENVIRONMENT" == "testing" ]]; then echo "true"; else echo "false"; fi)
  },
  "sparqConnectionConfig": {
    "projectPath": "$(pwd)",
    "databaseUrl": "\${DATABASE_URL}",
    "openaiApiKey": "\${OPENAI_API_KEY}",
    "supabaseUrl": "\${NEXT_PUBLIC_SUPABASE_URL}",
    "supabaseAnonKey": "\${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
  }
}
EOF
    echo -e "${INSTALL_GREEN}${BOLD}✅ Environment configuration created${RESET}"
else
    echo -e "${CALM_CYAN}ℹ️  Environment configuration already exists${RESET}"
fi

echo ""

# Environment variables check
echo -e "${PROGRESS_PURPLE}${BOLD}🔐 Checking Environment Variables${RESET}"

check_env_var() {
    local var_name="$1"
    local required="$2"
    
    if [[ -n "${!var_name}" ]]; then
        echo -e "${INSTALL_GREEN}${BOLD}   ✅ ${var_name} is set${RESET}"
    elif [[ "$required" == "true" ]]; then
        echo -e "${POWER_RED}${BOLD}   ❌ ${var_name} is required but not set${RESET}"
        return 1
    else
        echo -e "${WISDOM_GOLD}${BOLD}   ⚠️  ${var_name} is optional but not set${RESET}"
    fi
    return 0
}

# Core environment variables
echo -e "${CALM_CYAN}Checking core environment variables:${RESET}"
check_env_var "DATABASE_URL" "true"
check_env_var "OPENAI_API_KEY" "true"
check_env_var "NEXT_PUBLIC_SUPABASE_URL" "true"
check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "true"

# Optional environment variables for production features
if [[ "$ENVIRONMENT" == "staging" || "$ENVIRONMENT" == "production" ]]; then
    echo -e "${CALM_CYAN}Checking production environment variables:${RESET}"
    check_env_var "GOOGLE_MAPS_API_KEY" "false"
    check_env_var "BRAVE_SEARCH_API_KEY" "false"
fi

echo ""

# Test MCP servers
echo -e "${SETUP_BLUE}${BOLD}🧪 Testing MCP Server Connectivity${RESET}"

test_mcp_server() {
    local server_name="$1"
    local command="$2"
    
    echo -e "${PROGRESS_PURPLE}🔍 Testing ${server_name}...${RESET}"
    
    if eval "$command" &> /dev/null; then
        echo -e "${INSTALL_GREEN}${BOLD}   ✅ ${server_name} is responsive${RESET}"
        return 0
    else
        echo -e "${POWER_RED}${BOLD}   ❌ ${server_name} test failed${RESET}"
        return 1
    fi
}

# Test available servers
test_mcp_server "PostgreSQL MCP" "npx @modelcontextprotocol/server-postgres --help"
test_mcp_server "Sequential Thinking MCP" "npx @modelcontextprotocol/server-sequential-thinking --help"

if [[ "$ENVIRONMENT" != "production" ]]; then
    test_mcp_server "Puppeteer MCP" "npx puppeteer-mcp-server --help"
fi

echo ""

# Create usage documentation
echo -e "${PROGRESS_PURPLE}${BOLD}📚 Creating Quick Start Documentation${RESET}"

cat > ".mcp/QUICK_START.md" << 'EOF'
# Sparq Connection MCP Quick Start

## Available MCP Servers

### PostgreSQL MCP
```typescript
// Advanced database queries for relationship data
await postgresql.query({
  sql: `SELECT * FROM couples WHERE health_score > $1`,
  params: [80]
});
```

### Sequential Thinking MCP
```typescript
// Enhanced crisis assessment
await sequentialThinking.analyze({
  prompt: "Assess relationship crisis indicators",
  context: userMessage
});
```

### Puppeteer MCP (Development/Testing)
```typescript
// Automated testing of critical user journeys
await puppeteer.navigate({
  url: "http://localhost:3000/auth",
  waitFor: "form[data-testid='signup-form']"
});
```

### Google Maps MCP (Production)
```typescript
// Find crisis resources
await googleMaps.findNearby({
  query: "crisis counseling centers",
  location: userLocation,
  radius: 25000
});
```

### Brave Search MCP (Production)
```typescript
// Find relationship experts
await braveSearch.search({
  query: "relationship counselors near me",
  filters: ["mental health", "couples therapy"]
});
```

## Usage in Development
1. Start your Next.js server: `npm run dev`
2. MCP servers are automatically available
3. Use in your API routes or components

## Testing
Run `npm run mcp:test` to verify all servers are working.
EOF

echo -e "${INSTALL_GREEN}${BOLD}✅ Quick start documentation created${RESET}"

echo ""
echo -e "${SETUP_BLUE}${BOLD}${SHINE}🎉 MCP Setup Complete!${RESET}"
echo -e "${WISDOM_GOLD}${BOLD}✨ Sparq Connection is now enhanced with MCP capabilities${RESET}"
echo ""
echo -e "${CALM_CYAN}${BOLD}📋 Next Steps:${RESET}"
echo -e "${PROGRESS_PURPLE}   1. Set required environment variables in your .env file${RESET}"
echo -e "${PROGRESS_PURPLE}   2. Run 'npm run mcp:test' to verify everything works${RESET}"
echo -e "${PROGRESS_PURPLE}   3. Check .mcp/QUICK_START.md for usage examples${RESET}"
echo -e "${PROGRESS_PURPLE}   4. Start building amazing relationship intelligence features!${RESET}"
echo ""
echo -e "${INSTALL_GREEN}${BOLD}💝 Remember: We build rituals, not features. We create moments, not just products.${RESET}"

exit 0