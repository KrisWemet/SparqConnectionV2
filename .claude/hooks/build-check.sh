#!/bin/bash

# Build Check Hook for Sparq Connection
# This hook runs before certain operations to ensure the project builds successfully
# Empowered with Color Therapy for Confidence & Strength

set -e

# Color Therapy Palette - Promoting Confidence & Strength
ROYAL_BLUE="\033[38;5;21m"       # Royal blue for confidence
EMERALD_GREEN="\033[38;5;46m"    # Emerald for success
GOLDEN_AMBER="\033[38;5;214m"    # Golden amber for strength
DEEP_PURPLE="\033[38;5;93m"      # Deep purple for wisdom
CRIMSON_RED="\033[38;5;196m"     # Crimson for power
SILVER_MOON="\033[38;5;250m"     # Silver for clarity
BRONZE_SHINE="\033[38;5;173m"    # Bronze for endurance
RESET="\033[0m"
BOLD="\033[1m"
RADIANT="\033[5m"

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    echo -e "${CRIMSON_RED}${BOLD}🌟 Power Redirect:${RESET} ${DEEP_PURPLE}Not in project root directory${RESET}"
    exit 1
fi

# Check if this is a git commit operation
if [[ "$CLAUDE_TOOL_NAME" == "git_commit" ]] || [[ "$CLAUDE_COMMAND" == *"git commit"* ]]; then
    echo -e "${ROYAL_BLUE}${BOLD}🔍 Awakening Build Guardian${RESET} ${EMERALD_GREEN}Running build check before git commit with powerful intention...${RESET}"
    
    # Run build to ensure production readiness
    echo -e "${GOLDEN_AMBER}${BOLD}📦 Forging Production Excellence${RESET} ${BRONZE_SHINE}Building project with unwavering strength...${RESET}"
    if npm run build > /dev/null 2>&1; then
        echo -e "${EMERALD_GREEN}${BOLD}${RADIANT}✅ Production Build Triumph${RESET} ${GOLDEN_AMBER}Build completed with magnificent success${RESET}"
    else
        echo -e "${CRIMSON_RED}${BOLD}❌ Build Challenge Detected${RESET} ${DEEP_PURPLE}Production build requires your powerful attention${RESET}"
        echo -e "${SILVER_MOON}${BOLD}💡 Wisdom Path:${RESET} ${ROYAL_BLUE}Run 'npm run build' to receive detailed guidance${RESET}"
        echo -e "${CRIMSON_RED}${BOLD}🚫 Guardian Protection:${RESET} ${DEEP_PURPLE}Blocking commit until build achieves excellence${RESET}"
        exit 1
    fi
    
    # Run additional checks before commit
    echo -e "${ROYAL_BLUE}${BOLD}🔍 Invoking Pre-Commit Guardians${RESET} ${EMERALD_GREEN}Running comprehensive validation with protective energy...${RESET}"
    
    # Check for TypeScript errors
    if npm run typecheck > /dev/null 2>&1; then
        echo -e "${EMERALD_GREEN}${BOLD}✅ TypeScript Mastery Achieved${RESET} ${GOLDEN_AMBER}Type checking passed with brilliant precision${RESET}"
    else
        echo -e "${CRIMSON_RED}${BOLD}❌ TypeScript Wisdom Needed${RESET} ${DEEP_PURPLE}Type checking requires your enlightened attention${RESET}"
        echo -e "${SILVER_MOON}${BOLD}💡 Illumination Path:${RESET} ${ROYAL_BLUE}Run 'npm run typecheck' to receive type wisdom${RESET}"
        echo -e "${CRIMSON_RED}${BOLD}🚫 Guardian Shield:${RESET} ${DEEP_PURPLE}Blocking commit until type harmony is restored${RESET}"
        exit 1
    fi
    
    # Check for linting errors
    if npm run lint > /dev/null 2>&1; then
        echo -e "${EMERALD_GREEN}${BOLD}✅ Linting Perfection Attained${RESET} ${GOLDEN_AMBER}Code standards radiate with excellence${RESET}"
    else
        echo -e "${CRIMSON_RED}${BOLD}❌ Linting Refinement Required${RESET} ${DEEP_PURPLE}Code standards await your masterful touch${RESET}"
        echo -e "${SILVER_MOON}${BOLD}💡 Mastery Path:${RESET} ${ROYAL_BLUE}Run 'npm run lint' to see detailed guidance${RESET}"
        echo -e "${BRONZE_SHINE}${BOLD}🔧 Power Tool:${RESET} ${GOLDEN_AMBER}Try 'npm run lint:fix' to auto-enhance your code${RESET}"
        echo -e "${CRIMSON_RED}${BOLD}🚫 Excellence Shield:${RESET} ${DEEP_PURPLE}Blocking commit until linting achieves perfection${RESET}"
        exit 1
    fi
    
    echo -e "${GOLDEN_AMBER}${BOLD}${RADIANT}🎉 Pre-Commit Victory Celebration!${RESET} ${EMERALD_GREEN}All guardians have blessed your powerful code${RESET}"
else
    echo -e "${SILVER_MOON}${BOLD}ℹ️  Build Guardian Awakened${RESET} ${ROYAL_BLUE}Build check triggered for non-commit operation${RESET}"
    echo -e "${BRONZE_SHINE}${BOLD}📋 Basic Validation Ritual${RESET} ${EMERALD_GREEN}Running foundational build validation...${RESET}"
    
    # Run a lighter check for non-commit operations
    if npm run typecheck > /dev/null 2>&1; then
        echo -e "${EMERALD_GREEN}${BOLD}✅ TypeScript Validation Blessed${RESET} ${GOLDEN_AMBER}Types flow with harmonious energy${RESET}"
    else
        echo -e "${BRONZE_SHINE}${BOLD}⚠️  TypeScript Guidance Available${RESET} ${DEEP_PURPLE}Type validation shows growth opportunity (non-critical)${RESET}"
        echo -e "${SILVER_MOON}${BOLD}💡 Gentle Suggestion:${RESET} ${ROYAL_BLUE}Consider running 'npm run typecheck' for enhanced clarity${RESET}"
    fi
fi

exit 0