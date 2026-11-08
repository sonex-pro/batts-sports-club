python3 -m http.server 8000

Can you push all changes to GitHub main branch

Refresh Chrome Cmd+Shift+R

Since you want to include all modified files, run:
git  status
git  add  .

git  commit  -m  "Update index.html and another files"

git  push  origin  main

Note after add there is a space then a dot.