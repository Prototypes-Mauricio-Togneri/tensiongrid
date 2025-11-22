import 'package:flutter/foundation.dart';
import 'package:tensiongrid/utils/locator.dart';

abstract class Environment {
  String get name;

  bool get isDebug => kDebugMode;

  bool get isRelease => kReleaseMode;

  bool get isLocal => name == 'local';

  bool get isRemote => name == 'remote';

  Future configure() async {}

  static Environment get get => locator<Environment>();
}
