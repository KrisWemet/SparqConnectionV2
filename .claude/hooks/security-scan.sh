#!/bin/bash

# Security Scan Hook for Sparq Connection
# This hook runs after file modifications to ensure security best practices
# Fortified with Color Therapy for Protection & Guardian Energy

set -e

# Color Therapy Palette - Promoting Protection & Guardian Energy
MIDNIGHT_BLUE="\033[38;5;17m"    # Deep midnight blue for protection
GUARDIAN_GREEN="\033[38;5;22m"   # Dark green for security
SHIELD_GOLD="\033[38;5;220m"     # Bright gold for divine protection
MYSTIC_PURPLE="\033[38;5;54m"    # Mystical purple for wisdom
FIRE_RED="\033[38;5;196m"        # Intense red for alertness
PEARL_WHITE="\033[38;5;255m"     # Pure white for clarity
STEEL_GRAY="\033[38;5;240m"      # Steel gray for strength
RESET="\033[0m"
BOLD="\033[1m"
PULSE="\033[5m"

# Get the file paths passed by Claude Code
FILE_PATHS="$1"

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    echo -e "${FIRE_RED}${BOLD}⚡ Guardian Alert:${RESET} ${MYSTIC_PURPLE}Not in project root directory${RESET}"
    exit 1
fi

# Security patterns to check for
SECURITY_PATTERNS=(
    "console\.log.*password"
    "console\.log.*token"
    "console\.log.*secret"
    "console\.log.*key"
    "console\.log.*api"
    "\.env\."
    "process\.env\."
    "OPENAI_API_KEY"
    "SUPABASE.*KEY"
    "hardcoded.*password"
    "hardcoded.*token"
)

# Crisis detection patterns (important for Sparq Connection)
CRISIS_PATTERNS=(
    "crisis.*detect"
    "suicide"
    "self.*harm"
    "emergency.*contact"
    "crisis.*intervention"
    "mental.*health.*emergency"
)

echo -e "${MIDNIGHT_BLUE}${BOLD}🔐 Awakening Security Guardians${RESET} ${GUARDIAN_GREEN}Running protective scan with divine vigilance...${RESET}"

# Check if file paths contain security-sensitive files
if [[ -n "$FILE_PATHS" ]]; then
    # Check if any modified files are security-related
    if echo "$FILE_PATHS" | grep -E '(security|auth|crisis|encryption|ai)' > /dev/null; then
        echo -e "${FIRE_RED}${BOLD}${PULSE}🚨 Sacred Security Alert${RESET} ${MYSTIC_PURPLE}Security-sensitive files detected, invoking enhanced protection scan...${RESET}"
        
        # Enhanced security checks for sensitive files
        for file in $FILE_PATHS; do
            if [[ -f "$file" ]]; then
                echo -e "${SHIELD_GOLD}${BOLD}🔍 Guardian Examination${RESET} ${PEARL_WHITE}Scanning file with protective energy: $file${RESET}"
                
                # Check for potential security issues
                for pattern in "${SECURITY_PATTERNS[@]}"; do
                    if grep -i -n "$pattern" "$file" 2>/dev/null; then
                        echo -e "${FIRE_RED}${BOLD}⚠️  Security Shield Activated${RESET} ${MYSTIC_PURPLE}Potential security concern in $file: $pattern${RESET}"
                        echo -e "${PEARL_WHITE}${BOLD}💡 Guardian Wisdom:${RESET} ${GUARDIAN_GREEN}Consider removing or securing sensitive information${RESET}"
                    fi
                done
                
                # Check for crisis detection related code
                if echo "$file" | grep -E '(crisis|ai|security)' > /dev/null; then
                    echo -e "${MYSTIC_PURPLE}${BOLD}🩺 Crisis Guardian Scan${RESET} ${MIDNIGHT_BLUE}Checking crisis detection patterns in $file${RESET}"
                    for pattern in "${CRISIS_PATTERNS[@]}"; do
                        if grep -i -n "$pattern" "$file" 2>/dev/null; then
                            echo -e "${GUARDIAN_GREEN}${BOLD}✅ Crisis Protection Active${RESET} ${SHIELD_GOLD}Crisis detection pattern found: $pattern${RESET}"
                        fi
                    done
                fi
                
                # Check for encryption usage in security files
                if echo "$file" | grep -E 'security|encryption' > /dev/null; then
                    if grep -i -n "encrypt\|decrypt\|crypto" "$file" 2>/dev/null; then
                        echo -e "${SHIELD_GOLD}${BOLD}🔒 Encryption Shield Detected${RESET} ${GUARDIAN_GREEN}Encryption usage found in $file${RESET}"
                    fi
                fi
            fi
        done
    else
        echo -e "${MIDNIGHT_BLUE}${BOLD}ℹ️  Standard Guardian Patrol${RESET} ${STEEL_GRAY}No security-sensitive files modified, running basic protective scan...${RESET}"
        
        # Basic security scan for all files
        for file in $FILE_PATHS; do
            if [[ -f "$file" && "$file" =~ \.(ts|tsx|js|jsx)$ ]]; then
                # Check for common security issues
                if grep -i -n "password.*=.*['\"]" "$file" 2>/dev/null; then
                    echo -e "${FIRE_RED}${BOLD}⚠️  Password Guardian Alert${RESET} ${MYSTIC_PURPLE}Potential hardcoded password in $file${RESET}"
                fi
                
                if grep -i -n "api.*key.*=.*['\"]" "$file" 2>/dev/null; then
                    echo -e "${FIRE_RED}${BOLD}⚠️  API Key Guardian Alert${RESET} ${MYSTIC_PURPLE}Potential hardcoded API key in $file${RESET}"
                fi
            fi
        done
    fi
else
    echo -e "${STEEL_GRAY}${BOLD}ℹ️  Universal Guardian Blessing${RESET} ${MIDNIGHT_BLUE}No file paths provided, running general security blessing...${RESET}"
    
    # General security reminders
    echo -e "${SHIELD_GOLD}${BOLD}🔍 Sacred Security Checklist${RESET} ${GUARDIAN_GREEN}Guardian reminders for your protection:${RESET}"
    echo -e "${PEARL_WHITE}${BOLD}  ✓${RESET} ${MIDNIGHT_BLUE}Ensure no API keys are hardcoded${RESET}"
    echo -e "${PEARL_WHITE}${BOLD}  ✓${RESET} ${MIDNIGHT_BLUE}Verify crisis detection is functioning${RESET}"
    echo -e "${PEARL_WHITE}${BOLD}  ✓${RESET} ${MIDNIGHT_BLUE}Check encryption is properly implemented${RESET}"
    echo -e "${PEARL_WHITE}${BOLD}  ✓${RESET} ${MIDNIGHT_BLUE}Validate input sanitization${RESET}"
    echo -e "${PEARL_WHITE}${BOLD}  ✓${RESET} ${MIDNIGHT_BLUE}Ensure proper error handling${RESET}"
fi

# Check environment files for security
if [[ -f ".env" ]] || [[ -f ".env.local" ]]; then
    echo -e "${MYSTIC_PURPLE}${BOLD}🔍 Environment Guardian Scan${RESET} ${GUARDIAN_GREEN}Checking environment files with protective vigilance...${RESET}"
    
    for env_file in .env .env.local .env.production .env.development; do
        if [[ -f "$env_file" ]]; then
            echo -e "${FIRE_RED}${BOLD}⚠️  Environment Guardian Alert${RESET} ${PEARL_WHITE}Found environment file: $env_file${RESET}"
            echo -e "${SHIELD_GOLD}${BOLD}💡 Guardian Protection:${RESET} ${MIDNIGHT_BLUE}Ensure this file is not committed to version control${RESET}"
            echo -e "${SHIELD_GOLD}${BOLD}💡 Sacred Security:${RESET} ${MIDNIGHT_BLUE}Verify all secrets are properly secured${RESET}"
        fi
    done
fi

# Sparq Connection specific security checks
echo -e "${MYSTIC_PURPLE}${BOLD}🩺 Sparq Connection Guardian Blessing${RESET} ${GUARDIAN_GREEN}Running relationship platform security rituals...${RESET}"

# Check for crisis detection implementation
if [[ -f "src/lib/ai/openai.ts" ]]; then
    if grep -i "crisis" "src/lib/ai/openai.ts" > /dev/null 2>&1; then
        echo -e "${GUARDIAN_GREEN}${BOLD}✅ Crisis Guardian Active${RESET} ${SHIELD_GOLD}Crisis detection found in AI service${RESET}"
    else
        echo -e "${FIRE_RED}${BOLD}⚠️  Crisis Guardian Needed${RESET} ${MYSTIC_PURPLE}Crisis detection may not be implemented in AI service${RESET}"
    fi
fi

# Check for encryption implementation
if [[ -f "src/lib/security/encryption.ts" ]]; then
    if grep -i "encrypt\|decrypt" "src/lib/security/encryption.ts" > /dev/null 2>&1; then
        echo -e "${GUARDIAN_GREEN}${BOLD}✅ Encryption Guardian Blessed${RESET} ${SHIELD_GOLD}Encryption implementation found${RESET}"
    else
        echo -e "${FIRE_RED}${BOLD}⚠️  Encryption Guardian Incomplete${RESET} ${MYSTIC_PURPLE}Encryption implementation may need enhancement${RESET}"
    fi
fi

echo -e "${SHIELD_GOLD}${BOLD}${PULSE}🎉 Security Guardian Blessing Complete!${RESET} ${GUARDIAN_GREEN}Your code is now protected by divine security energy${RESET}"

exit 0