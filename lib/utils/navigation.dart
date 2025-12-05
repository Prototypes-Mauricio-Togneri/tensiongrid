import 'package:dafluta/dafluta.dart';
import 'package:flutter/widgets.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/presentation/home/home_screen.dart';
import 'package:tensiongrid/presentation/match/match_screen.dart';
import 'package:tensiongrid/presentation/result/result_screen.dart';
import 'package:tensiongrid/utils/locator.dart';

class Navigation {
  final Routes routes = Routes();

  static Navigation get get => locator<Navigation>();

  static BuildContext context() => get.routes.key.currentContext!;

  static void pop<T>([T? result]) => get.routes.pop(result);

  static void homeScreen() => get.routes.pushAlone(
    BasicRoute(
      HomeScreen.instance(),
      name: 'home',
    ),
  );

  static void matchScreen(Match match) => get.routes.push(
    BasicRoute(
      MatchScreen.instance(match),
      name: 'match',
    ),
  );

  static void resultScreen(Match match) => get.routes.pushReplacement(
    BasicRoute(
      ResultScreen.instance(match),
      name: 'result',
    ),
  );
}
