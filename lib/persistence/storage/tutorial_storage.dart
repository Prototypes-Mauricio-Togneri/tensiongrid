import 'package:tensiongrid/persistence/storage/base_storage.dart';

class TutorialStorage extends Storage {
  static const FIELD_EVENTS = 'tutorial.events';

  static Future saveEvents(List<String> events) =>
      Storage.setStringList(FIELD_EVENTS, events);

  static Future<List<String>> loadEvents() =>
      Storage.getStringList(FIELD_EVENTS, []);

  static Future clear() async {
    await Storage.clear(FIELD_EVENTS);
  }
}
