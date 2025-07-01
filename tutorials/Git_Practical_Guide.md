# Git and GitHub: Practical Hands-on Guide

This guide provides step-by-step walkthroughs for common Git and GitHub scenarios to complement the main tutorial.

## Table of Contents
1. [Setting Up Your First Repository](#setting-up-your-first-repository)
2. [Collaborative Workflow Example](#collaborative-workflow-example)
3. [Resolving Merge Conflicts Walkthrough](#resolving-merge-conflicts-walkthrough)
4. [Feature Branch Development Cycle](#feature-branch-development-cycle)
5. [Git Rebase Illustrated](#git-rebase-illustrated)
6. [Setting Up GitHub Pages](#setting-up-github-pages)
7. [Creating and Using GitHub Actions](#creating-and-using-github-actions)
8. [Recovering from Common Mistakes](#recovering-from-common-mistakes)

## Setting Up Your First Repository

### Local Repository First Approach

```bash
# Step 1: Create a folder for your project
mkdir my-first-project
cd my-first-project

# Step 2: Initialize Git repository
git init

# Step 3: Create some initial files
echo "# My First Project" > README.md
echo "node_modules/" > .gitignore

# Step 4: Add and commit the files
git add README.md .gitignore
git commit -m "Initial commit"

# Step 5: Create a repository on GitHub (don't initialize with README)

# Step 6: Connect your local repo to GitHub
git remote add origin https://github.com/username/my-first-project.git

# Step 7: Push your local repository to GitHub
git push -u origin main
```

### GitHub-First Approach

```bash
# Step 1: Create a repository on GitHub (initialize with README)

# Step 2: Clone the repository locally
git clone https://github.com/username/my-first-project.git
cd my-first-project

# Step 3: Create some initial files
echo "node_modules/" > .gitignore

# Step 4: Add and commit the files
git add .gitignore
git commit -m "Add .gitignore file"

# Step 5: Push your changes to GitHub
git push origin main
```

## Collaborative Workflow Example

### Fork and Pull Request Workflow

This workflow is common when contributing to open source projects or when working on repositories where you don't have write access.

#### For the Contributor:

```bash
# Step 1: Fork the repository on GitHub
# (Click the Fork button on the repository page)

# Step 2: Clone your forked repository
git clone https://github.com/your-username/project.git
cd project

# Step 3: Add the original repository as an "upstream" remote
git remote add upstream https://github.com/original-owner/project.git

# Step 4: Create a feature branch
git checkout -b feature-branch

# Step 5: Make your changes
# (Edit files, add new files, etc.)

# Step 6: Commit your changes
git add .
git commit -m "Add new feature"

# Step 7: Stay updated with upstream changes
git fetch upstream
git rebase upstream/main

# Step 8: Push your feature branch to your fork
git push origin feature-branch

# Step 9: Create a Pull Request on GitHub
# (Go to your fork on GitHub and click "New Pull Request")
```

#### For the Repository Maintainer:

```bash
# Step 1: Review the Pull Request on GitHub

# Step 2: Fetch and check out the PR locally (optional)
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Step 3: Run tests, review code, etc.

# Step 4: Merge the Pull Request on GitHub
# (Click "Merge Pull Request" on the PR page)

# Step 5: Update your local repository
git checkout main
git pull origin main
```

### Direct Collaboration Workflow

This workflow is common when working with a team on a shared repository where everyone has write access.

```bash
# Step 1: Clone the repository
git clone https://github.com/team/project.git
cd project

# Step 2: Create a feature branch
git checkout -b feature-x

# Step 3: Make your changes
# (Edit files, add new files, etc.)

# Step 4: Regularly pull from main to stay updated
git checkout main
git pull
git checkout feature-x
git merge main

# Step 5: Commit your changes
git add .
git commit -m "Implement feature X"

# Step 6: Push your branch
git push origin feature-x

# Step 7: Create a Pull Request on GitHub
# (Go to the repository and click "Compare & pull request")

# Step 8: After approval and merge, update and clean up
git checkout main
git pull
git branch -d feature-x  # Delete local branch
git push origin --delete feature-x  # Delete remote branch
```

## Resolving Merge Conflicts Walkthrough

```bash
# Scenario: You're working on a feature branch and need to merge changes from main

# Step 1: Update your main branch
git checkout main
git pull origin main

# Step 2: Switch back to your feature branch
git checkout feature-branch

# Step 3: Try to merge main into your feature branch
git merge main

# Step 4: Git will indicate merge conflicts, showing something like:
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt
# Automatic merge failed; fix conflicts and then commit the result.

# Step 5: Open the conflicted file(s) in your editor
# You'll see conflict markers like:
# <<<<<<< HEAD (Current change)
# Your code
# =======
# Their code
# >>>>>>> main (Incoming change)

# Step 6: Manually edit the file to resolve conflicts
# Delete the conflict markers and merge the code as appropriate

# Step 7: After resolving all conflicts, add the files
git add file.txt

# Step 8: Complete the merge by committing
git commit -m "Merge main into feature-branch, resolve conflicts"

# Step 9: Push your resolved branch
git push origin feature-branch
```

### Using Visual Tools for Conflict Resolution

```bash
# Using a built-in merge tool
git mergetool

# Using VS Code as your merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

## Feature Branch Development Cycle

This is a complete workflow for developing a feature from start to finish.

```bash
# Step 1: Make sure main is up to date
git checkout main
git pull origin main

# Step 2: Create a feature branch
git checkout -b feature/user-authentication

# Step 3: Work on your feature (multiple commit cycle)
# ... make some changes ...
git add .
git commit -m "Add login form"

# ... make more changes ...
git add .
git commit -m "Add authentication service"

# ... fix something ...
git add .
git commit -m "Fix validation issues"

# Step 4: Push your branch to remote
git push -u origin feature/user-authentication

# Step 5: Keep your branch updated with main
git checkout main
git pull origin main
git checkout feature/user-authentication
git merge main
# (resolve any conflicts if necessary)

# Step 6: Create a PR on GitHub when your feature is complete

# Step 7: Address review feedback
# ... make changes based on feedback ...
git add .
git commit -m "Address PR feedback"
git push origin feature/user-authentication

# Step 8: After your PR is merged
git checkout main
git pull origin main
git branch -d feature/user-authentication
```

## Git Rebase Illustrated

### Cleaning Up Your Branch Before Sharing

```bash
# Scenario: You've made several small commits and want to clean them up
# before creating a pull request

# Step 1: Make sure your working directory is clean
git status

# Step 2: Start an interactive rebase
git rebase -i HEAD~3  # Rebase the last 3 commits

# Step 3: An editor will open with entries like:
# pick abc1234 Add login form
# pick def5678 Fix typo in login form
# pick ghi9101 Adjust form styling

# Step 4: Edit the commands to combine commits
# pick abc1234 Add login form
# fixup def5678 Fix typo in login form
# fixup ghi9101 Adjust form styling

# Step 5: Save and close the editor
# Git will combine the commits

# Step 6: Force push to update your remote branch
# (Only do this if the branch is yours alone)
git push --force-with-lease origin feature-branch
```

### Incorporating Changes from Main

```bash
# Scenario: Main has been updated and you want to include those changes
# in your feature branch using rebase

# Step 1: Update your main branch
git checkout main
git pull origin main

# Step 2: Switch to your feature branch
git checkout feature-branch

# Step 3: Rebase your branch onto the updated main
git rebase main

# Step 4: Resolve any conflicts during the rebase
# Git will stop when it encounters a conflict
# Edit the files to resolve conflicts
git add .
git rebase --continue
# Repeat until rebase is complete

# Step 5: Push your updated branch
git push --force-with-lease origin feature-branch
```

## Setting Up GitHub Pages

### Project Site from Main Branch

```bash
# Step 1: Create an index.html file in the root of your repository
echo "<h1>My GitHub Pages Site</h1>" > index.html

# Step 2: Commit and push the file
git add index.html
git commit -m "Add index.html for GitHub Pages"
git push origin main

# Step 3: Go to your repository on GitHub
# Step 4: Go to Settings > Pages
# Step 5: Under "Source", select "main" branch and "/" folder
# Step 6: Click "Save"
# Step 7: Your site will be published at https://username.github.io/repository-name/
```

### Project Site from gh-pages Branch

```bash
# Step 1: Create a gh-pages branch
git checkout -b gh-pages

# Step 2: Create your website files
echo "<h1>My GitHub Pages Site</h1>" > index.html

# Step 3: Commit and push the gh-pages branch
git add index.html
git commit -m "Create GitHub Pages site"
git push origin gh-pages

# Step 4: Go to your repository on GitHub
# Step 5: Go to Settings > Pages
# Step 6: Under "Source", select "gh-pages" branch and "/" folder
# Step 7: Click "Save"
```

### Using GitHub Actions to Deploy Pages

Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install and Build
        run: |
          npm ci
          npm run build
          
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: build
```

## Creating and Using GitHub Actions

### Setting Up a Basic CI Workflow

Create a file `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
      
    - name: Run linter
      run: npm run lint
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
```

### Adding Status Badges to README.md

```markdown
# My Project

[![CI](https://github.com/username/repository/actions/workflows/ci.yml/badge.svg)](https://github.com/username/repository/actions/workflows/ci.yml)

Project description here
```

## Recovering from Common Mistakes

### Undo the Last Commit (Keep Changes)

```bash
# If you want to keep the changes but undo the commit
git reset --soft HEAD~1

# Now the changes are staged and ready for a new commit
git status
```

### Undo the Last Commit (Discard Changes)

```bash
# If you want to completely discard the commit and its changes
git reset --hard HEAD~1
```

### Undo a Public Commit (Safely)

```bash
# Create a new commit that undoes the changes
git revert HEAD
```

### Fix a Commit Message

```bash
# For the most recent commit
git commit --amend -m "New commit message"

# For an older commit (more complex)
git rebase -i HEAD~3  # Replace 3 with how far back the commit is
# Change "pick" to "reword" for the commit to edit
# Save and close editor, then enter new message in next editor
```

### Recover Deleted Branch

```bash
# Step 1: Find the lost commit it pointed to
git reflog

# Step 2: Create a new branch at that commit
git checkout -b recovered-branch abc1234  # Replace with actual commit hash
```

### Stashing Uncommitted Changes

```bash
# Save changes without committing
git stash

# List all stashes
git stash list

# Apply the most recent stash
git stash apply

# Apply a specific stash
git stash apply stash@{2}

# Apply and remove the most recent stash
git stash pop

# Remove a specific stash
git stash drop stash@{1}
```

### Remove a File from Git History

```bash
# Remove a sensitive file from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive-file.txt" \
  --prune-empty -- --all

# Force push to replace history on remote
git push origin --force --all

# Note: This rewrites history and should be used with caution
# Team members will need to re-clone or perform complex operations to sync
```

---

## Git Cheat Sheet

### Setting Up

```bash
# Configure user name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize a repository
git init

# Clone a repository
git clone https://github.com/username/repository.git
```

### Day-to-Day Work

```bash
# Check status
git status

# Add files
git add file.txt      # Single file
git add .             # All files

# Commit
git commit -m "Message"
git commit -am "Message"  # Add tracked files and commit

# Branching
git branch                # List branches
git branch new-branch     # Create branch
git checkout new-branch   # Switch to branch
git checkout -b new-branch  # Create and switch
git branch -d branch-name  # Delete branch

# Remote operations
git remote -v                          # List remotes
git remote add origin url              # Add remote
git push -u origin branch              # Push and track
git pull                               # Pull changes
git fetch                              # Fetch without merging
```

### Advanced Operations

```bash
# Viewing history
git log
git log --oneline --graph

# Comparing
git diff                  # Working vs staged
git diff --staged         # Staged vs committed
git diff branch1..branch2  # Between branches

# Undoing
git restore file.txt      # Discard changes (Git 2.23+)
git restore --staged file.txt  # Unstage (Git 2.23+)
git reset --soft HEAD~1   # Undo commit, keep changes
git reset --hard HEAD~1   # Undo commit, discard changes
git revert HEAD           # Create a new "undo" commit
```

Happy Git and GitHub journey!
