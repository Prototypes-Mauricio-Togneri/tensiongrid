import 'package:chronochicken/platform/platform_mobile.dart'
    if (dart.library.js_interop) 'package:chronochicken/platform/platform_web.dart';

class SetFullscreen {
  static void set() => PlatformMethods().webFullscreen();
}
