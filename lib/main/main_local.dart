import 'dart:async';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/tension_grid.dart';
import 'package:tensiongrid/environments/environment_local.dart';
import 'package:tensiongrid/utils/error_handler.dart';
import 'package:tensiongrid/utils/locator.dart';

void main() {
  runZonedGuarded(() async {
    await Locator.load(LocalEnvironment());
    runApp(const TensionGrid());
  }, ErrorHandler.onUncaughtError);
}
