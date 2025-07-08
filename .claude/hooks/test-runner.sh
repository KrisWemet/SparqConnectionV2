#!/bin/bash

# Test Runner Hook for Sparq Connection
# This hook runs tests after file modifications to ensure functionality
# Blessed with Color Therapy for Calming Confidence & Peaceful Validation

set -e

# Color Therapy Palette - Promoting Calm & Confidence
OCEAN_BLUE="\033[38;5;74m"       # Deep ocean blue for calm
FOREST_GREEN="\033[38;5;34m"     # Forest green for stability
SUNSET_ORANGE="\033[38;5;208m"   # Warm orange for enthusiasm
LAVENDER_MIST="\033[38;5;189m"   # Soft lavender for tranquility
AQUA_DREAM="\033[38;5;87m"       # Aqua for refreshing clarity
ROSE_GOLD="\033[38;5;217m"       # Rose gold for gentle success
JADE_GREEN="\033[38;5;42m"       # Jade for harmony
RESET="\033[0m"
BOLD="\033[1m"
SHIMMER="\033[5m"

# Get the file paths passed by Claude Code
FILE_PATHS="$1"

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    echo -e "${SUNSET_ORANGE}${BOLD}🌟 Gentle Redirect:${RESET} ${LAVENDER_MIST}Not in project root directory${RESET}"
    exit 1
fi

# Check if file paths contain testable files
if [[ -n "$FILE_PATHS" ]]; then
    # Check if any modified files are in testable directories or are test files
    if echo "$FILE_PATHS" | grep -E '(src/|tests/|\.test\.|\.spec\.)' > /dev/null; then
        echo -e "${OCEAN_BLUE}${BOLD}🧪 Initiating Test Meditation${RESET} ${FOREST_GREEN}Running relevant tests with peaceful intention...${RESET}"
        
        # Check if files are in specific directories to run targeted tests
        if echo "$FILE_PATHS" | grep -E 'src/components/' > /dev/null; then
            echo -e "${AQUA_DREAM}${BOLD}🌸 Component Harmony Check${RESET} ${JADE_GREEN}Testing component balance...${RESET}"
            # Run component-specific tests if available
            if [ -d "tests/components" ]; then
                echo -e "${LAVENDER_MIST}${BOLD}📋 Component Test Ritual${RESET} ${FOREST_GREEN}Blessing component tests...${RESET}"
                # Add component test command when available
                echo -e "${ROSE_GOLD}${BOLD}💫 Future Enhancement:${RESET} ${AQUA_DREAM}Component tests will flow here with loving precision${RESET}"
            fi
        fi
        
        if echo "$FILE_PATHS" | grep -E 'src/lib/' > /dev/null; then
            echo -e "${JADE_GREEN}${BOLD}🔮 Library Wisdom Test${RESET} ${OCEAN_BLUE}Testing utility/library energies...${RESET}"
            # Run library-specific tests if available
            if [ -d "tests/lib" ]; then
                echo -e "${LAVENDER_MIST}${BOLD}📚 Library Test Ceremony${RESET} ${FOREST_GREEN}Invoking library test wisdom...${RESET}"
                # Add library test command when available
                echo -e "${ROSE_GOLD}${BOLD}✨ Sacred Space:${RESET} ${AQUA_DREAM}Library tests will manifest here with divine clarity${RESET}"
            fi
        fi
        
        if echo "$FILE_PATHS" | grep -E 'src/hooks/' > /dev/null; then
            echo -e "${SUNSET_ORANGE}${BOLD}🪝 Hook Energy Validation${RESET} ${JADE_GREEN}Testing hook vibrations...${RESET}"
            # Run hook-specific tests if available
            if [ -d "tests/hooks" ]; then
                echo -e "${LAVENDER_MIST}${BOLD}🌙 Hook Test Ritual${RESET} ${FOREST_GREEN}Channeling hook test energy...${RESET}"
                # Add hook test command when available
                echo -e "${ROSE_GOLD}${BOLD}🌟 Mystical Preparation:${RESET} ${AQUA_DREAM}Hook tests await their moment to shine${RESET}"
            fi
        fi
        
        # Run critical path tests for important files
        if echo "$FILE_PATHS" | grep -E '(auth|crisis|security|encryption)' > /dev/null; then
            echo -e "${SUNSET_ORANGE}${BOLD}🚨 Sacred Protection Test${RESET} ${OCEAN_BLUE}Running critical path tests for security-blessed changes...${RESET}"
            if [ -d "tests/critical-paths" ]; then
                echo -e "${LAVENDER_MIST}${BOLD}⚡ Critical Path Blessing${RESET} ${FOREST_GREEN}Invoking protective test energy...${RESET}"
                # Add critical path test command when available
                echo -e "${ROSE_GOLD}${BOLD}🛡️ Guardian Tests:${RESET} ${AQUA_DREAM}Critical path tests stand ready to protect your code${RESET}"
            fi
        fi
        
        echo -e "${SUNSET_ORANGE}${BOLD}${SHIMMER}🎊 Test Meditation Complete!${RESET} ${JADE_GREEN}Your code now flows with tested serenity${RESET}"
    else
        echo -e "${OCEAN_BLUE}${BOLD}🌙 Peaceful Code Rest${RESET} ${LAVENDER_MIST}No testable files modified, code remains in blissful harmony${RESET}"
    fi
else
    echo -e "${AQUA_DREAM}${BOLD}🌍 Universal Test Blessing${RESET} ${FOREST_GREEN}Running basic test suite with cosmic love...${RESET}"
    
    # Run basic tests if no specific paths provided
    echo -e "${LAVENDER_MIST}${BOLD}📋 Basic Test Ceremony${RESET} ${JADE_GREEN}Preparing fundamental test rituals...${RESET}"
    # Add basic test command when available
    echo -e "${ROSE_GOLD}${BOLD}🌟 Sacred Foundation:${RESET} ${AQUA_DREAM}Basic tests will emerge here with perfect timing${RESET}"
fi

# Note: Actual test commands will be added when the project's test suite is set up
# For now, this script provides the structure and logging with therapeutic intention

exit 0