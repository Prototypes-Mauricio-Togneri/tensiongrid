import 'package:flutter/material.dart';
import 'package:tensiongrid/presentation/splash/splash_screen.dart';
import 'package:tensiongrid/utils/navigation.dart';
import 'package:tensiongrid/utils/palette.dart';

class TensionGrid extends StatelessWidget {
  const TensionGrid();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tension Grid',
      debugShowCheckedModeBanner: false,
      navigatorKey: Navigation.get.routes.key,
      theme: ThemeData(
        primaryColor: Palette.PRIMARY,
        primarySwatch: Palette.PRIMARY,
        colorScheme: ColorScheme.fromSeed(seedColor: Palette.PRIMARY),
        scaffoldBackgroundColor: Palette.SCREEN_BACKGROUND,
      ),
      home: SplashScreen.instance(),
    );
  }
}
