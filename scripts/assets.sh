#!/usr/bin/env bash

set -e

flutter clean
flutter pub upgrade
flutter pub run daassets:daassets.dart ./pubspec.yaml ./lib/utils/assets.dart

# Replace "assets/images/" with "" in assets.dart
sed -i 's/assets\/images\///g' ./lib/utils/assets.dart

dart format lib