import 'package:tensiongrid/environments/environment.dart';

class Flags {
  static bool get autoSetup => Environment.get.isDebug;

  static bool get autoStartMatch => Environment.get.isDebug;

  static bool get showTutorial => Environment.get.isRelease;
}
