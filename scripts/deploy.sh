#!/usr/bin/env bash

set -e

./scripts/version.sh
firebase deploy --only hosting