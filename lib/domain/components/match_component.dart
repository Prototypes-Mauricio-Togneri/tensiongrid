import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/sound.dart';

class MatchComponent extends World {
  final Vector2 resolution;
  final Match match;
  final MatchState state;

  MatchComponent({
    required this.resolution,
    required this.match,
    required this.state,
  }) {
    MatchComponentRef.instance = this;
  }

  @override
  void update(double dt) {
    super.update(dt);

    match.update(dt);
    state.notify();
  }

  void onTileTapped(TileComponent tileComponent) {
    final ActionResult result = match.onTileTapped(tileComponent.tile);

    if (result.removeTile) {
      tileComponent.removeFromParent();
    }

    if (result.soundTap) {
      Audio.get.playSound(Sound.TILE_TAP);
    }

    if (result.soundError) {
      Audio.get.playSound(Sound.TILE_ERROR);
    }

    if (result.eventCompleted) {
      Audio.get.playSound(Sound.NEXT_STAGE);
      state.notify();
    }
  }

  @override
  FutureOr onLoad() {
    add(
      GridComponent(
        position: Vector2(0, 0),
        size: resolution,
        match: match,
      ),
    );

    return super.onLoad();
  }
}

mixin MatchComponentRef {
  static late MatchComponent instance;

  MatchComponent get match => instance;
}
