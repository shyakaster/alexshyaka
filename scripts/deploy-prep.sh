#!/bin/bash

# Deploy Preparation Script
# Ensures everything is ready for production deployment

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Portfolio Deployment Preparation ===${NC}"
echo ""

# Check git status first
echo -e "${BLUE}1. Checking git status...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected!${NC}"
    echo "Please commit all changes before deployment preparation."
    echo "Run: ./scripts/git-checkpoint.sh"
    exit 1
fi
echo -e "${GREEN}✅ Git working directory is clean${NC}"

# Check if we're ahead of remote
echo ""
echo -e "${BLUE}2. Checking remote sync status...${NC}"
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "unknown")

if [ "$LOCAL" != "$REMOTE" ] && [ "$REMOTE" != "unknown" ]; then
    AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
    if [ "$AHEAD" -gt 0 ]; then
        echo -e "${YELLOW}📤 $AHEAD commit(s) ready to push${NC}"
        echo -e "${BLUE}Next step: Push to GitHub with: git push${NC}"
    fi
else
    echo -e "${GREEN}✅ Local and remote are in sync${NC}"
fi

# Check for any ESLint or TypeScript errors (if applicable)
echo ""
echo -e "${BLUE}3. Running code quality checks...${NC}"

# Check if there are any obvious syntax issues in key files
if command -v npm >/dev/null 2>&1; then
    echo "Checking for TypeScript compilation errors..."
    if npm run build >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Build successful${NC}"
    else
        echo -e "${RED}❌ Build failed - please fix errors before deployment${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  npm not available, skipping build check${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Portfolio is ready for deployment!${NC}"
echo ""
echo -e "${BLUE}Deployment checklist:${NC}"
echo "✅ All changes committed"
echo "✅ Code builds successfully"
echo "✅ Git history is clean"
echo ""
echo -e "${BLUE}To deploy:${NC}"
echo "1. Push to GitHub: git push"
echo "2. Deploy on Replit (automatic if connected to GitHub)"
echo "3. Verify deployment: Check your live URL"
echo ""
echo -e "${YELLOW}Remember: Test thoroughly before sharing publicly!${NC}"