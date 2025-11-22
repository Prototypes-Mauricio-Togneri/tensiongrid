import 'package:chronochicken/utils/navigation.dart';
import 'package:dafluta/dafluta.dart';

class SplashState extends BaseState {
  @override
  void onLoad() {
    Delayed.post(Navigation.homeScreen);
  }
}
