import 'package:dafluta/dafluta.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:tensiongrid/persistence/storage/settings_storage.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/utils/authentication.dart';
import 'package:tensiongrid/utils/navigation.dart';

class SplashState extends BaseState {
  @override
  Future onLoad() async {
    await Audio.get.load();

    Authentication.checkIfAuthenticated(
      onSuccess: _onSuccess,
      onError: _onError,
    );
  }

  void _onSuccess(User user) => _processUser(user);

  Future _onError() async {
    final User user = await Authentication.signInAnonymously();
    await _processUser(user);
  }

  Future _processUser(User user) async {
    final String name = await SettingsStorage.loadName();

    if (name.isEmpty) {
      Navigation.setupScreen();
    } else {
      Navigation.homeScreen();
    }
  }
}
