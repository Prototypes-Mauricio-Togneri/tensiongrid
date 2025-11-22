import 'dart:ui';
import 'package:chronochicken/environments/environment.dart';
import 'package:chronochicken/platform/operations/set_url_strategy.dart';
import 'package:chronochicken/utils/navigation.dart';
import 'package:chronochicken/utils/platform.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

final GetIt locator = GetIt.instance;

class Locator {
  static Future load(Environment environment) async {
    WidgetsFlutterBinding.ensureInitialized();

    if (Platform.isWeb) {
      await Firebase.initializeApp(
        options: const FirebaseOptions(
          apiKey: 'AIzaSyDOnRsvxIM7fOUAWMNtjW4R2lmQ2hHDffQ',
          authDomain: 'chrono-chicken.firebaseapp.com',
          projectId: 'chrono-chicken',
          storageBucket: 'chrono-chicken.firebasestorage.app',
          messagingSenderId: '665767144566',
          appId: '1:665767144566:web:827b979acb75919147c357',
          measurementId: 'G-73R27JT00F',
        ),
      );
    } else {
      await Firebase.initializeApp();

      await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(true);
      FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;
      PlatformDispatcher.instance.onError = (error, stack) {
        FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
        return true;
      };
    }

    SetUrlStrategy.set();

    locator.registerSingleton<Environment>(environment);
    locator.registerSingleton<Navigation>(Navigation());

    await environment.configure();
  }
}
