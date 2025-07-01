# Git and GitHub Quick Reference

## Initial Setup

### Install Git
- **Windows**: Download from git-scm.com or `choco install git`
- **macOS**: `brew install git` or download from git-scm.com
- **Linux**: `sudo apt-get install git` or `sudo dnf install git`

### Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"  # For VS Code
```

### Authentication
- **HTTPS with credential manager**: Uses system credential storage
- **SSH Keys**: More secure, no password required for each push
  ```bash
  # Generate SSH key
  ssh-keygen -t ed25519 -C "your.email@example.com"
  # Add to GitHub in Settings > SSH and GPG keys
  ```

## Repository Setup

### Create New Repository
```bash
# Local first
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# GitHub first
# Create on GitHub.com, then:
git clone https://github.com/username/repo.git
cd repo
# Make changes
git push
```

## Daily Workflow Commands

### Basic Workflow
```bash
git status              # Check status of working directory
git add file.txt        # Stage specific file
git add .               # Stage all changes
git commit -m "Message" # Commit staged changes
git push                # Push to remote repository
git pull                # Update from remote repository
```

### Branches
```bash
git branch                    # List branches
git branch feature-name       # Create branch
git checkout feature-name     # Switch to branch
git checkout -b feature-name  # Create and switch
git switch feature-name       # Switch (Git 2.23+)
git switch -c feature-name    # Create and switch (Git 2.23+)
git push -u origin feature-name # Push branch to remote
git branch -d feature-name    # Delete branch locally
git push origin --delete feature-name # Delete branch on remote
```

### Examining Changes
```bash
git diff                  # Changes in working directory
git diff --staged         # Changes staged for commit
git log                   # View commit history
git log --oneline --graph # Compact history visualization
git show commit-hash      # View specific commit details
git blame file.txt        # See who changed each line
```

## Undoing Changes

### Working Directory Changes
```bash
git restore file.txt      # Discard changes (Git 2.23+)
git checkout -- file.txt  # Discard changes (older Git)
```

### Staged Changes
```bash
git restore --staged file.txt # Unstage (Git 2.23+)
git reset HEAD file.txt       # Unstage (older Git)
```

### Committed Changes
```bash
git revert HEAD           # Create new commit that undoes last commit
git reset --soft HEAD~1   # Undo commit, keep changes staged
git reset --mixed HEAD~1  # Undo commit, keep changes unstaged (default)
git reset --hard HEAD~1   # Undo commit, discard changes (DANGEROUS)
```

### Amending Commits
```bash
git commit --amend        # Change last commit message or add forgotten files
git commit --amend --no-edit # Amend without changing message
```

## Collaboration

### Remote Repositories
```bash
git remote -v                  # List remotes
git remote add origin URL      # Add remote
git remote set-url origin URL  # Change remote URL
git fetch origin               # Get remote changes without merging
git pull origin branch-name    # Fetch and merge
git push origin branch-name    # Push local branch
```

### Merging
```bash
git checkout main          # Switch to target branch
git merge feature-branch   # Merge feature branch into current branch
git merge --abort          # Abort a merge with conflicts
```

### Rebasing
```bash
git checkout feature-branch # Switch to branch
git rebase main            # Rebase onto main
git rebase -i HEAD~3       # Interactive rebase last 3 commits
git rebase --abort         # Abort a rebase
git push --force-with-lease # Push rewritten history (USE CAREFULLY)
```

## Temporary Storage

### Stashing
```bash
git stash                  # Stash changes
git stash save "message"   # Stash with a message
git stash list             # List stashes
git stash apply            # Apply most recent stash
git stash apply stash@{2}  # Apply specific stash
git stash pop              # Apply and remove most recent stash
git stash drop stash@{1}   # Delete specific stash
git stash clear            # Delete all stashes
```

## Advanced Operations

### Tagging
```bash
git tag v1.0.0             # Create lightweight tag
git tag -a v1.0.0 -m "Version 1.0.0" # Create annotated tag
git push origin v1.0.0     # Push tag to remote
git push origin --tags     # Push all tags
git tag -d v1.0.0          # Delete tag locally
git push origin --delete v1.0.0 # Delete tag from remote
```

### Submodules
```bash
git submodule add URL path # Add submodule
git submodule update --init # Initialize submodules after clone
git clone --recurse-submodules URL # Clone with submodules
```

### Cherry-picking
```bash
git cherry-pick commit-hash # Apply specific commit to current branch
```

## GitHub Specific

### Pull Requests
1. Fork repository (if not your own)
2. Create a branch (`git checkout -b feature`)
3. Make changes, commit, and push (`git push origin feature`)
4. Go to GitHub and click "Compare & pull request"
5. Add description and create PR
6. Address review feedback
7. PR gets merged

### GitHub Issues
- Use for bug reports, feature requests, or discussions
- Link to PRs with `#issue-number` in commit or PR description
- Close issues with commit messages using keywords:
  - `fixes #123`, `closes #123`, `resolves #123`

### GitHub Actions Workflow Example
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
```

## Git Aliases (Optional)

Add to `~/.gitconfig`:
```
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = restore --staged
  undo = reset --soft HEAD~1
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

## Common Issues & Solutions

### "Failed to push some refs"
```bash
git pull --rebase origin main
git push origin main
```

### Accidental Commit to Wrong Branch
```bash
git reset HEAD~1 --soft  # Undo commit but keep changes
git stash                # Stash the changes
git checkout correct-branch
git stash pop            # Apply changes
git commit -m "Message"  # Commit to correct branch
```

### "Refusing to merge unrelated histories"
```bash
git pull origin main --allow-unrelated-histories
```

### Remove Files from Git History
```bash
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch path/to/file" HEAD
```

### Recover Deleted Branch
```bash
git reflog               # Find the commit hash of branch tip
git checkout -b branch-name commit-hash
```

For more detailed information, refer to the full Git and GitHub tutorial.

---

## Git Command Cheatsheet

### Setup
- `git config` - Configure Git
- `git init` - Initialize repository
- `git clone` - Clone repository

### Basic
- `git add` - Stage changes
- `git commit` - Record changes
- `git status` - Show status
- `git push` - Upload changes
- `git pull` - Download changes

### Branches
- `git branch` - List/manage branches
- `git checkout` - Switch branches
- `git merge` - Join branches
- `git rebase` - Reapply commits

### Inspection
- `git log` - Show history
- `git diff` - Show changes
- `git show` - Show objects
- `git blame` - Show change author

### Undoing
- `git restore` - Restore files
- `git reset` - Reset current HEAD
- `git revert` - Revert commits
- `git rm` - Remove files

### Collaboration
- `git fetch` - Download objects
- `git remote` - Manage remotes
- `git cherry-pick` - Apply commits
- `git stash` - Stash changes

### Advanced
- `git tag` - Create/list tags
- `git worktree` - Manage worktrees
- `git bisect` - Binary search
- `git submodule` - Manage submodules
