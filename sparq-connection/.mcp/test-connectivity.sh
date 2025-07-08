#!/bin/bash

# MCP Server Connectivity Test for Sparq Connection
# Tests MCP server availability without requiring environment variables

set -e

# Color Therapy Palette
TEST_BLUE="\033[38;5;75m"
SUCCESS_GREEN="\033[38;5;46m"
INFO_CYAN="\033[38;5;87m"
WARN_ORANGE="\033[38;5;214m"
ERROR_RED="\033[38;5;196m"
RESET="\033[0m"
BOLD="\033[1m"

echo -e "${TEST_BLUE}${BOLD}🧪 MCP Server Connectivity Test${RESET}"
echo -e "${INFO_CYAN}Testing installed MCP servers...${RESET}"
echo ""

# Test function
test_mcp_server() {
    local server_name="$1"
    local package_name="$2"
    local test_command="$3"
    
    echo -e "${INFO_CYAN}🔍 Testing ${server_name}...${RESET}"
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${SUCCESS_GREEN}${BOLD}   ✅ ${server_name} is available and responsive${RESET}"
        return 0
    else
        echo -e "${ERROR_RED}${BOLD}   ❌ ${server_name} is not available${RESET}"
        echo -e "${WARN_ORANGE}   💡 Try: npm install -g ${package_name}${RESET}"
        return 1
    fi
}

# Test core MCP servers
echo -e "${TEST_BLUE}${BOLD}🎯 Testing Core MCP Servers${RESET}"

test_mcp_server \
    "PostgreSQL MCP" \
    "@modelcontextprotocol/server-postgres" \
    "npx @modelcontextprotocol/server-postgres --help"

test_mcp_server \
    "Sequential Thinking MCP" \
    "@modelcontextprotocol/server-sequential-thinking" \
    "npx @modelcontextprotocol/server-sequential-thinking --help"

echo ""
echo -e "${TEST_BLUE}${BOLD}🧪 Testing Development MCP Servers${RESET}"

test_mcp_server \
    "Puppeteer MCP" \
    "puppeteer-mcp-server" \
    "npx puppeteer-mcp-server --help"

echo ""
echo -e "${TEST_BLUE}${BOLD}🌍 Testing Production MCP Servers${RESET}"

test_mcp_server \
    "Google Maps MCP" \
    "@modelcontextprotocol/server-google-maps" \
    "npx @modelcontextprotocol/server-google-maps --help"

test_mcp_server \
    "Brave Search MCP" \
    "@modelcontextprotocol/server-brave-search" \
    "npx @modelcontextprotocol/server-brave-search --help"

echo ""
echo -e "${SUCCESS_GREEN}${BOLD}🎉 MCP Connectivity Test Complete!${RESET}"
echo -e "${INFO_CYAN}All installed MCP servers are ready for use.${RESET}"

exit 0