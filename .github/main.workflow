workflow "On Push" {
  on = "push"
  resolves = ["Build"]
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
