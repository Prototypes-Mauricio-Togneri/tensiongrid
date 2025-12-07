import 'package:dafluta/dafluta.dart';
import 'package:flutter/widgets.dart';
import 'package:tensiongrid/persistence/storage/settings_storage.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/utils/navigation.dart';

class SettingsState extends BaseState {
  final TextEditingController nameController = TextEditingController();

  bool get canSave => nameController.text.trim().isNotEmpty;

  @override
  Future onLoad() async {
    nameController.text = await SettingsStorage.loadName();
    notify();
  }

  void onClose() => Navigation.pop();

  Future onAudioToggle() async {
    await Audio.get.toggle();
    notify();
  }

  Future onSave() async {
    final String name = nameController.text.trim();
    await SettingsStorage.saveName(name);
    Navigation.pop();
  }
}
