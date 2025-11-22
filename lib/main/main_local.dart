import 'dart:async';
import 'package:chronochicken/app/chrono_chicken.dart';
import 'package:chronochicken/environments/environment_local.dart';
import 'package:chronochicken/utils/error_handler.dart';
import 'package:chronochicken/utils/locator.dart';
import 'package:flutter/material.dart';

void main() {
  runZonedGuarded(() async {
    await Locator.load(LocalEnvironment());
    runApp(const ChronoChicken());
  }, ErrorHandler.onUncaughtError);
}