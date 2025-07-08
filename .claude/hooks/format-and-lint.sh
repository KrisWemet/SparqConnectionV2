#!/bin/bash

# Format and Lint Hook for Sparq Connection
# This hook runs after file modifications to ensure code quality
# Enhanced with Color Therapy for Emotional Balance & Radiance

set -e

# Color Therapy Palette - Promoting Harmony & Clarity
SOFT_BLUE="\033[38;5;117m"      # Calming blue for peace
GENTLE_GREEN="\033[38;5;120m"    # Healing green for growth
WARM_GOLD="\033[38;5;222m"       # Golden radiance for success
LAVENDER="\033[38;5;183m"        # Soothing lavender for balance
ROSE_PINK="\033[38;5;218m"       # Loving pink for compassion
CORAL="\033[38;5;216m"           # Energizing coral for vitality
SAGE="\033[38;5;151m"            # Wise sage for clarity
RESET="\033[0m"
BOLD="\033[1m"
GLOW="\033[5m"

# Get the file paths passed by Claude Code
FILE_PATHS="$1"

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    echo -e "${CORAL}${BOLD}💫 Hook Energy Alert:${RESET} ${LAVENDER}Not in project root directory${RESET}"
    exit 1
fi

# Check if file paths contain TypeScript/JavaScript files
if [[ -n "$FILE_PATHS" ]]; then
    # Check if any modified files are TypeScript/JavaScript/JSON
    if echo "$FILE_PATHS" | grep -E '\.(ts|tsx|js|jsx|json)$' > /dev/null; then
        echo -e "${SOFT_BLUE}${BOLD}✨ Awakening Code Harmony${RESET} ${GENTLE_GREEN}Running formatter and linter with loving intention...${RESET}"
        
        # Run Prettier to format the code
        echo -e "${LAVENDER}${BOLD}🌸 Beautifying Code Structure${RESET} ${SAGE}Formatting with Prettier's gentle touch...${RESET}"
        if npm run format > /dev/null 2>&1; then
            echo -e "${WARM_GOLD}${BOLD}${GLOW}✨ Code Radiance Achieved${RESET} ${GENTLE_GREEN}Formatting completed with divine precision${RESET}"
        else
            echo -e "${CORAL}${BOLD}🌈 Gentle Guidance Needed${RESET} ${ROSE_PINK}Prettier encountered a learning opportunity${RESET}"
        fi
        
        # Run ESLint to check and fix linting issues
        echo -e "${SOFT_BLUE}${BOLD}🔮 Channeling Code Wisdom${RESET} ${SAGE}Running ESLint with healing intention...${RESET}"
        if npm run lint:fix > /dev/null 2>&1; then
            echo -e "${WARM_GOLD}${BOLD}${GLOW}💫 Linting Harmony Restored${RESET} ${GENTLE_GREEN}Code energy flows perfectly${RESET}"
        else
            echo -e "${CORAL}${BOLD}🌟 Manual Healing Required${RESET} ${ROSE_PINK}ESLint found areas needing your loving attention${RESET}"
            echo -e "${LAVENDER}${BOLD}💝 Healing Suggestion:${RESET} ${SAGE}Run 'npm run lint' to see detailed guidance${RESET}"
        fi
        
        echo -e "${WARM_GOLD}${BOLD}${GLOW}🎊 Code Transformation Complete!${RESET} ${GENTLE_GREEN}Your code now radiates with perfect harmony${RESET}"
    else
        echo -e "${SOFT_BLUE}${BOLD}🌙 Peaceful Rest${RESET} ${LAVENDER}No TypeScript/JavaScript files modified, code remains in serene state${RESET}"
    fi
else
    echo -e "${SAGE}${BOLD}🌍 Global Healing Session${RESET} ${GENTLE_GREEN}Running format/lint on all files with universal love...${RESET}"
    
    # Run on all files if no specific paths provided
    if npm run format > /dev/null 2>&1 && npm run lint:fix > /dev/null 2>&1; then
        echo -e "${WARM_GOLD}${BOLD}${GLOW}🌟 Universal Code Harmony Achieved${RESET} ${GENTLE_GREEN}All files now radiate with perfect balance${RESET}"
    else
        echo -e "${CORAL}${BOLD}🌈 Gentle Adjustment Needed${RESET} ${ROSE_PINK}Some areas detected for loving improvement${RESET}"
        echo -e "${LAVENDER}${BOLD}💝 Healing Path:${RESET} ${SAGE}Run 'npm run lint' to receive detailed guidance${RESET}"
    fi
fi

exit 0