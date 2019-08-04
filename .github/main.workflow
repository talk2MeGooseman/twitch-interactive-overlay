workflow "Push, Install, Lint, Deploy" {
  resolves = ["Deploy to GitHub Pages"]
  on = "push"
}

action "Install" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Lint" {
  needs = "Install"
  uses = "Borales/actions-yarn@master"
  args = "lint"
}

action "Filter Master" {
  needs = "Lint"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Build" {
  needs = "Filter Master"
  uses = "Borales/actions-yarn@master"
  args = "dist"
  secrets = ["GH_PAT"]
}

action "Deploy to GitHub Pages" {
  needs = "Build"
  uses = "maxheld83/ghpages@v0.2.1"
  env = {
    BUILD_DIR = "dist/"
  }
  secrets = ["GH_PAT"]
}
