import 'dart:ui';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:tensiongrid/environments/environment.dart';
import 'package:tensiongrid/platform/operations/set_url_strategy.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/utils/navigation.dart';
import 'package:tensiongrid/utils/platform.dart';

final GetIt locator = GetIt.instance;

class Locator {
  static Future load(Environment environment) async {
    WidgetsFlutterBinding.ensureInitialized();

    if (Platform.isWeb) {
      await Firebase.initializeApp(
        options: const FirebaseOptions(
          apiKey: 'AIzaSyCv1u8NNWyF0HbyeYqRKGY9QJjnrHeSweM',
          authDomain: 'tension-grid.firebaseapp.com',
          projectId: 'tension-grid',
          storageBucket: 'tension-grid.firebasestorage.app',
          messagingSenderId: '917756221178',
          appId: '1:917756221178:web:f4b710ddf314d640e05b43',
          measurementId: 'G-YLBGZJL3TV',
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
    locator.registerSingleton<Audio>(Audio());

    await environment.configure();
  }
}
