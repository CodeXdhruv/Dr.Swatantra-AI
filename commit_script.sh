#!/bin/bash
git add .
FILES=$(git diff --name-only --cached)

git reset

COUNT=0
for FILE in $FILES; do
    git add "$FILE"
    git commit -m "Update $FILE"
    COUNT=$((COUNT+1))
    if [ $COUNT -ge 40 ]; then
        break
    fi
done

git add .
if ! git diff --cached --quiet; then
    git commit -m "Add remaining changes"
fi
git push origin refactor
