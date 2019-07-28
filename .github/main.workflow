workflow "Push, Install, Lint, Deploy" {
  resolves = ["Build"]
  on = "push"
}


workflow "Pull Request, Lint, Deploy" {
  resolves = ["Build"]
  on = "pull_request"
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
}
