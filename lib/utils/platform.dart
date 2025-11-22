import 'package:flutter/foundation.dart';

class Platform {
  static final bool isAndroid = defaultTargetPlatform == TargetPlatform.android;

  static final bool isIOS = defaultTargetPlatform == TargetPlatform.iOS;

  static const bool isWeb = kIsWeb;

  static final bool isMobile = isAndroid || isIOS;

  static final bool isMobileNative = isMobile && !isWeb;
}
