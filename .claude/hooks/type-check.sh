#!/bin/bash

# TypeScript Type Check Hook for Sparq Connection
# This hook runs after file modifications to ensure type safety
# Infused with Color Therapy for Mental Clarity & Confidence

set -e

# Color Therapy Palette - Promoting Clarity & Confidence
CRYSTAL_BLUE="\033[38;5;153m"    # Clear blue for mental clarity
MINT_GREEN="\033[38;5;158m"      # Fresh mint for renewal
GOLDEN_YELLOW="\033[38;5;227m"   # Bright yellow for intellect
AMETHYST="\033[38;5;177m"        # Purple for wisdom
TURQUOISE="\033[38;5;80m"        # Turquoise for communication
PEACH="\033[38;5;215m"           # Warm peach for encouragement
EMERALD="\033[38;5;46m"          # Emerald for success
RESET="\033[0m"
BOLD="\033[1m"
SPARKLE="\033[5m"

# Get the file paths passed by Claude Code
FILE_PATHS="$1"

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    echo -e "${PEACH}${BOLD}🌟 Clarity Alert:${RESET} ${AMETHYST}Not in project root directory${RESET}"
    exit 1
fi

# Check if file paths contain TypeScript files
if [[ -n "$FILE_PATHS" ]]; then
    # Check if any modified files are TypeScript
    if echo "$FILE_PATHS" | grep -E '\.(ts|tsx)$' > /dev/null; then
        echo -e "${CRYSTAL_BLUE}${BOLD}🔮 Awakening Type Wisdom${RESET} ${MINT_GREEN}Running TypeScript type checking with crystal clarity...${RESET}"
        
        # Run TypeScript type checking
        echo -e "${AMETHYST}${BOLD}📚 Consulting the Type Oracle${RESET} ${TURQUOISE}Checking TypeScript types with divine insight...${RESET}"
        if npm run typecheck > /dev/null 2>&1; then
            echo -e "${GOLDEN_YELLOW}${BOLD}${SPARKLE}✨ Type Harmony Achieved${RESET} ${EMERALD}TypeScript validation passed with radiant precision${RESET}"
        else
            echo -e "${PEACH}${BOLD}🌈 Growth Opportunity Detected${RESET} ${AMETHYST}TypeScript found areas for enlightenment${RESET}"
            echo -e "${TURQUOISE}${BOLD}💎 Wisdom Path:${RESET} ${MINT_GREEN}Run 'npm run typecheck' to receive detailed guidance${RESET}"
            echo -e "${CRYSTAL_BLUE}${BOLD}🌟 Loving Reminder:${RESET} ${AMETHYST}Consider embracing these type insights before committing${RESET}"
        fi
        
        echo -e "${GOLDEN_YELLOW}${BOLD}${SPARKLE}🎊 Type Clarity Session Complete!${RESET} ${EMERALD}Your TypeScript now flows with perfect understanding${RESET}"
    else
        echo -e "${CRYSTAL_BLUE}${BOLD}🌙 Peaceful TypeScript Meditation${RESET} ${AMETHYST}No TypeScript files modified, types remain in perfect harmony${RESET}"
    fi
else
    echo -e "${TURQUOISE}${BOLD}🌍 Universal Type Alignment${RESET} ${MINT_GREEN}Running full type check with cosmic awareness...${RESET}"
    
    # Run full type check if no specific paths provided
    if npm run typecheck > /dev/null 2>&1; then
        echo -e "${GOLDEN_YELLOW}${BOLD}${SPARKLE}🌟 Universal Type Harmony${RESET} ${EMERALD}Full TypeScript validation radiates with perfect clarity${RESET}"
    else
        echo -e "${PEACH}${BOLD}🌈 Gentle Enlightenment Needed${RESET} ${AMETHYST}TypeScript discovered opportunities for growth${RESET}"
        echo -e "${TURQUOISE}${BOLD}💎 Illumination Path:${RESET} ${MINT_GREEN}Run 'npm run typecheck' to receive detailed wisdom${RESET}"
    fi
fi

exit 0