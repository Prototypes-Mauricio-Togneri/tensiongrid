import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/environments/environment.dart';
import 'package:tensiongrid/utils/generator.dart';
import 'package:tensiongrid/utils/navigation.dart';

class HomeState extends BaseState {
  @override
  void onLoad() {
    Delayed.post(onStart);
  }

  void onStart() {
    if (Environment.get.isDebug) {
      Navigation.matchScreen(MatchGenerator.test());
    }
  }
}
