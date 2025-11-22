import 'package:tensiongrid/platform/platform_mobile.dart'
    if (dart.library.js_interop) 'package:tensiongrid/platform/platform_web.dart';

class SetFullscreen {
  static void set() => PlatformMethods().webFullscreen();
}
