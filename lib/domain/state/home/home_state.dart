import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/utils/flags.dart';
import 'package:tensiongrid/utils/generator.dart';
import 'package:tensiongrid/utils/navigation.dart';

class HomeState extends BaseState {
  @override
  void onLoad() {
    if (Flags.autoStartMatch) {
      Delayed.post(onStart);
    }
  }

  void onStart() => Navigation.matchScreen(MatchGenerator.test());

  void onSettings() => Navigation.settingsScreen();
}
