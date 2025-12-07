import 'dart:async';
import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/persistence/storage/settings_storage.dart';
import 'package:tensiongrid/utils/navigation.dart';
import 'package:tensiongrid/utils/stream_listener.dart';

class LobbyState extends BaseState {
  Grid? _grid;
  bool isCanceling = false;
  final StreamListener _roomListener = StreamListener();

  bool get isLoading => _grid == null;

  @override
  Future onLoad() async {
    final String name = await SettingsStorage.loadName();
    Delayed.post(() => _searchMatch(name));
  }

  Future _searchMatch(String name) async {
    // Implementation for searching a match
    /*_room = await const StartMatchmakingCallable()(
      playerName: name,
      version: 1,
      matchType: 'pvp',
      numberOfPlayers: 2,
      visibility: RoomVisibility.public,
      deck: deck,
    );
    notify();

    _roomListener.start(
      RoomRepository.listen(
        roomId: _room!.id,
        onUpdated: _onUpdated,
      ),
    );*/
  }

  @override
  void onDestroy() {
    _roomListener.stop();
  }

  Future onCancel() async {
    isCanceling = true;
    notify();
    Navigation.pop();
  }
}
