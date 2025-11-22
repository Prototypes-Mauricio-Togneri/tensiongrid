#!/usr/bin/env bash

set -e

flutter clean
flutter build web -t lib/main/main_remote.dart --release

# Fix for assets in wrong folder
# mkdir -p build/web/assets/images
# cp -r build/web/assets/assets/images/** build/web/assets/images

# mkdir -p build/web/assets/audio
# cp -r build/web/assets/assets/audio/** build/web/assets/audio

rm -rf public/*
cp -r build/web/** ./public

firebase use remote
firebase deploy --only hosting
firebase use local