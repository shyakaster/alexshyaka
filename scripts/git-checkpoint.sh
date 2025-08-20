#!/bin/bash

# Git Checkpoint Script for Alex Nkusi Portfolio
# Creates structured commits with meaningful messages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Git Checkpoint Creator ===${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}No changes detected. Nothing to commit.${NC}"
    exit 0
fi

echo -e "${GREEN}Changes detected. Creating checkpoint...${NC}"
echo ""

# Show current status
echo -e "${BLUE}Current changes:${NC}"
git status --short

echo ""
echo -e "${BLUE}Detailed changes:${NC}"
git diff --stat

echo ""

# Commit type options
echo -e "${BLUE}Select commit type:${NC}"
echo "1. feat: New feature or enhancement"
echo "2. fix: Bug fix or correction"
echo "3. style: UI/styling changes"
echo "4. content: Content updates (blog posts, text)"
echo "5. refactor: Code refactoring"
echo "6. config: Configuration changes"
echo "7. docs: Documentation updates"
echo "8. custom: Enter custom type"

read -p "Enter choice (1-8): " choice

case $choice in
    1) TYPE="feat" ;;
    2) TYPE="fix" ;;
    3) TYPE="style" ;;
    4) TYPE="content" ;;
    5) TYPE="refactor" ;;
    6) TYPE="config" ;;
    7) TYPE="docs" ;;
    8) 
        read -p "Enter custom type: " TYPE
        ;;
    *) 
        echo -e "${RED}Invalid choice. Using 'feat' as default.${NC}"
        TYPE="feat"
        ;;
esac

# Get commit message
echo ""
read -p "Enter brief description (what was changed): " DESCRIPTION

if [ -z "$DESCRIPTION" ]; then
    echo -e "${RED}Description cannot be empty${NC}"
    exit 1
fi

# Optional detailed description
echo ""
read -p "Enter detailed description (optional, press Enter to skip): " DETAILED

# Create commit message
if [ -n "$DETAILED" ]; then
    COMMIT_MSG="$TYPE: $DESCRIPTION

$DETAILED

Checkpoint: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$TYPE: $DESCRIPTION

Checkpoint: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo -e "${BLUE}Commit message preview:${NC}"
echo "---"
echo "$COMMIT_MSG"
echo "---"
echo ""

read -p "Proceed with this commit? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo -e "${YELLOW}Commit cancelled.${NC}"
    exit 0
fi

# Add all changes and commit
git add .
git commit -m "$COMMIT_MSG"

echo ""
echo -e "${GREEN}✅ Checkpoint created successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review your commit: git log -1 --stat"
echo "2. When ready to publish: git push"
echo ""
echo -e "${YELLOW}Note: Changes are committed locally. Use 'git push' to sync with GitHub.${NC}"