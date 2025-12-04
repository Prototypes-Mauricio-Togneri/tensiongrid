import 'package:tensiongrid/environments/environment.dart';
import 'package:tensiongrid/persistence/storage/base_storage.dart';

class SettingsStorage extends Storage {
  static const FIELD_AUDIO = 'settings.audio';
  static const FIELD_NAME = 'settings.name';

  static Future saveAudio(bool value) => Storage.setBool(FIELD_AUDIO, value);

  static Future<bool> loadAudio() =>
      Storage.getBool(FIELD_AUDIO, Environment.get.isRelease || true);

  static Future saveName(String name) => Storage.setString(FIELD_NAME, name);

  static Future<String> loadName() => Storage.getString(FIELD_NAME, '');

  static Future clear() async {
    await Storage.clear(FIELD_AUDIO);
    await Storage.clear(FIELD_NAME);
  }
}
