import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/utils/flags.dart';
import 'package:tensiongrid/utils/navigation.dart';

class HomeState extends BaseState {
  @override
  void onLoad() {
    if (Flags.autoStartMatch) {
      Delayed.post(onPlay);
    }
  }

  void onPlay() => Navigation.lobbyScreen();

  void onSettings() => Navigation.settingsScreen();
}
