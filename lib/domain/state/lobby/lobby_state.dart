import 'dart:async';
import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/persistence/repository/grid_repository.dart';
import 'package:tensiongrid/persistence/storage/settings_storage.dart';
import 'package:tensiongrid/utils/generator.dart';
import 'package:tensiongrid/utils/navigation.dart';

class LobbyState extends BaseState {
  Grid? _grid;
  bool isCanceling = false;

  bool get isLoading => _grid == null;

  @override
  Future onLoad() async {
    final String name = await SettingsStorage.loadName();
    Delayed.post(() => _searchMatch(name));
  }

  Future _searchMatch(String name) async {
    final GridRepository repository = await GridRepository.instance();
    _grid = await repository.getMatch();

    Navigation.matchScreen(MatchGenerator.test(_grid!));
  }

  Future onCancel() async {
    isCanceling = true;
    notify();
    Navigation.pop();
  }
}
