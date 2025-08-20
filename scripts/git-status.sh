#!/bin/bash

# Git Status Overview Script
# Provides comprehensive project status

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Portfolio Project Git Status ===${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}Current branch:${NC} $CURRENT_BRANCH"

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    echo -e "${GREEN}Working directory:${NC} Clean (no uncommitted changes)"
else
    echo -e "${YELLOW}Working directory:${NC} Has uncommitted changes"
    echo ""
    echo -e "${BLUE}Uncommitted changes:${NC}"
    git status --short
fi

echo ""

# Recent commits
echo -e "${BLUE}Recent commits:${NC}"
git log --oneline -5 --graph --decorate

echo ""

# Remote status
echo -e "${BLUE}Remote status:${NC}"
if git ls-remote --exit-code origin >/dev/null 2>&1; then
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "unknown")
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}✅ Local and remote are in sync${NC}"
    elif [ "$REMOTE" = "unknown" ]; then
        echo -e "${YELLOW}⚠️  Remote status unknown${NC}"
    else
        AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
        BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
        
        if [ "$AHEAD" -gt 0 ]; then
            echo -e "${YELLOW}📤 $AHEAD commit(s) ahead of remote${NC}"
        fi
        if [ "$BEHIND" -gt 0 ]; then
            echo -e "${RED}📥 $BEHIND commit(s) behind remote${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Cannot reach remote repository${NC}"
fi

echo ""

# Quick actions
echo -e "${PURPLE}Quick actions:${NC}"
echo "• Create checkpoint: ./scripts/git-checkpoint.sh"
echo "• View detailed log: git log --stat -5"
echo "• Push to GitHub: git push origin main"
echo "• Pull from GitHub: git pull origin main"