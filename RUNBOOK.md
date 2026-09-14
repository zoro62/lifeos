# Your 40-Minute Execution Checklist

Everything below produces REAL, honest proof — no faked screenshots. Follow in order.

## 1. GitHub Repo (5 min)
```bash
mkdir lifeos && cd lifeos
git init
# copy in: README.md, .gitignore, backend/, frontend/, docker-compose.yml, docs/
git add .
git commit -m "Initial commit: vision doc, backend scaffold, architecture diagram"
gh repo create lifeos --public --source=. --push
# OR create on github.com manually, then:
# git remote add origin <your-repo-url>
# git branch -M main
# git push -u origin main
```
📸 Screenshot: your GitHub repo page showing files + README rendered.

## 2. Feature Branch (2 min)
```bash
git checkout -b feature/backend-health-endpoint
git commit --allow-empty -m "Start backend health endpoint work"
git push -u origin feature/backend-health-endpoint
```
📸 Screenshot: GitHub "branches" dropdown showing `main` and your feature branch.

## 3. GitHub Issues — 25 User Stories (5 min)
Install GitHub CLI if you don't have it, then:
```bash
gh auth login
bash create_issues.sh
```
Or paste `user_stories.md` content into GitHub Projects manually if `gh` isn't installed.
📸 Screenshot: GitHub Issues list showing all 25 with labels.

## 4. Docker Build & Run (10–15 min — this takes real time, start it early)
```bash
docker compose up --build
```
Wait for `Started LifeosBackendApplication` in the logs.
📸 Screenshot: terminal showing successful `docker compose up --build`.

## 5. Verify in Browser (2 min)
Open: http://localhost:8080/ and http://localhost:8080/health
📸 Screenshot: browser showing the JSON response.

## 6. Figma Wireframes (remaining time)
Use Figma free tier — 6 screens: Login, Dashboard, Tasks, Habits, Goals, Counter detail. Low-fidelity boxes/labels are fine for Review 1; polish later.

## 7. Architecture Diagram
Open `docs/architecture.drawio` at https://app.diagrams.net → File → Open From → Device. Already built — just review and export a PNG if the rubric wants an image too.

## 8. MoSCoW Prioritization
Already embedded in `user_stories.md` and the issue labels from step 3 — nothing extra needed.
