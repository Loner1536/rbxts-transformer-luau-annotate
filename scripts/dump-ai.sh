#!/usr/bin/env bash
# dump.sh — compact source dump for AI context

DIR="${1:-.}"
EXT="${2:-}"

if [ ! -d "$DIR" ]; then
    echo "Error: '$DIR' is not a directory" >&2
    exit 1
fi

if [ -n "$EXT" ]; then
    FILES=$(find "$DIR" -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/out/*' | grep -E "\.(${EXT})$" | sort)
else
    FILES=$(find "$DIR" -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/out/*' | sort)
fi

TOTAL=$(echo "$FILES" | grep -c .)
TOTAL_LINES=0

echo "# src:$DIR n:$TOTAL"
echo ""

echo "$FILES" | while IFS= read -r file; do
    CLEAN="${file#./}"
    EXT_HINT="${CLEAN##*.}"
    LINES=$(wc -l <"$file")
    echo "## $CLEAN ($LINES lines)"
    echo "\`\`\`${EXT_HINT}"
    # Preserve content exactly, only strip trailing whitespace
    sed 's/[[:space:]]*$//' "$file"
    echo "\`\`\`"
    echo ""
done
