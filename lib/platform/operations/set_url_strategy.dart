import 'package:tensiongrid/platform/platform_mobile.dart'
    if (dart.library.js_interop) 'package:tensiongrid/platform/platform_web.dart';

class SetUrlStrategy {
  static void set() => PlatformMethods().urlStrategy();
}
