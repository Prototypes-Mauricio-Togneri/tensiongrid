import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/utils/navigation.dart';

class SplashState extends BaseState {
  @override
  Future onLoad() async {
    await Audio.get.load();
    Delayed.post(Navigation.homeScreen);
  }
}
