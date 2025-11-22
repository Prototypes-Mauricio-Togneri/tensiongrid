import 'package:chronochicken/presentation/splash/splash_screen.dart';
import 'package:chronochicken/utils/navigation.dart';
import 'package:chronochicken/utils/palette.dart';
import 'package:flutter/material.dart';

class ChronoChicken extends StatelessWidget {
  const ChronoChicken();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chrono Chicken',
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
