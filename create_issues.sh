#!/bin/bash
# Run this INSIDE your repo after `gh auth login` and `gh repo create` / after pushing.
# Requires GitHub CLI: https://cli.github.com/
# Usage: bash create_issues.sh

set -e

# Create labels (ignore errors if they already exist)
gh label create "must-have" --color "d73a4a" --force
gh label create "should-have" --color "fbca04" --force
gh label create "could-have" --color "0e8a16" --force
gh label create "wont-have" --color "d4c5f9" --force

create() {
  gh issue create --title "$1" --body "$2" --label "$3"
}

create "Account Registration" "As a new user, I want to sign up with email/password or Google, so that I can create a secure personal account." "must-have"
create "Login with Biometric" "As a returning user, I want to log in with fingerprint after my first password login, so that daily access is fast and seamless." "must-have"
create "Multi-Account Switching" "As a user sharing a device, I want to switch between accounts, so that my data stays isolated from others." "must-have"
create "Dashboard Overview" "As a user, I want to see today's tasks, habits, and goals on one dashboard, so that I don't have to open multiple apps." "must-have"
create "Create Task" "As a user, I want to create a task with a due date and priority, so that I can track what needs to get done." "must-have"
create "Nested Subtasks" "As a user, I want to break a task into subtasks, so that I can manage complex work step by step." "must-have"
create "Recurring Tasks" "As a user, I want to mark a task as recurring, so that I don't have to recreate routine tasks manually." "must-have"
create "Create Note" "As a user, I want to write and save a note, so that I can capture information quickly." "must-have"
create "Create Habit" "As a user, I want to define a daily habit, so that I can track consistency over time." "must-have"
create "Habit Streak Tracking" "As a user, I want to see my current streak for a habit, so that I stay motivated to continue." "must-have"
create "Create Counter" "As a user, I want to create a custom counter (e.g., pushups, books read), so that I can track anything important to me." "must-have"
create "Increment Counter" "As a user, I want to increment a counter with one tap, so that logging is effortless." "must-have"
create "Create Goal" "As a user, I want to set a goal with a target and deadline, so that I can work toward something concrete." "must-have"
create "Goal Progress Tracking" "As a user, I want my goal's progress bar to update automatically, so that I can see how close I am to completion." "must-have"
create "Cloud Sync" "As a user, I want my data synced to the cloud, so that I don't lose it if I change phones." "must-have"

create "Journal Entry" "As a user, I want to write a daily journal entry with mood tracking, so that I can reflect on my day." "should-have"
create "Expense Logging" "As a user, I want to log an expense with a category, so that I can track where my money goes." "should-have"
create "Document Vault Upload" "As a user, I want to securely store a document (e.g., ID, certificate), so that I can access it anytime without carrying paper copies." "should-have"
create "Password Vault Entry" "As a user, I want to store a password with AES encryption, so that my credentials are safe and accessible." "should-have"
create "AI Weekly Summary" "As a user, I want an AI-generated weekly summary of my tasks and habits, so that I can understand my patterns without manual review." "should-have"
create "Kanban Board View" "As a user, I want to view my tasks in a Kanban board, so that I can visualize progress across stages." "should-have"

create "Google Calendar Sync" "As a user, I want my LifeOS calendar synced with Google Calendar, so that I have one unified schedule." "could-have"
create "Receipt OCR Scanning" "As a user, I want to scan a receipt and auto-fill an expense entry, so that logging expenses takes seconds." "could-have"
create "Automation Rules" "As a user, I want to create a rule like 'workout completed -> increase gym counter -> mark habit done', so that repetitive updates happen automatically." "could-have"

create "Smartwatch Sync" "As a user, I want my fitness data synced from a smartwatch, so that I don't have to log workouts manually." "wont-have"

echo "All 25 issues created."
