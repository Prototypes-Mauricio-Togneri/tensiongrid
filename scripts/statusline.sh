#!/usr/bin/env bash

INPUT=$(cat)
echo "$INPUT" > /tmp/statusline_input.json
MODEL=$(echo "$INPUT" | jq -r '.model.display_name' | sed 's/ (1M context)//')
CONTEXT_SIZE=$(echo "$INPUT" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$INPUT" | jq '.context_window.current_usage')

WINDOW=$(echo "$INPUT" | jq -r '.rate_limits.five_hour.used_percentage // 0')

if [ "$USAGE" != "null" ]; then
    CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    PERCENT_USED=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))
    echo "[$MODEL] Context: ${PERCENT_USED}% | Window: ${WINDOW}%"
else
    echo "[$MODEL] Context: 0% | Window: ${WINDOW}%"
fi