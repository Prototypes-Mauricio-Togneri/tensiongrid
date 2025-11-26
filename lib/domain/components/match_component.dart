import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/topbar_component.dart';
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
      Audio.get.playSound(Sound.EVENT_COMPLETED);
      state.notify();
    }
  }

  @override
  FutureOr onLoad() {
    add(
      TopbarComponent(
        position: Vector2(
          0,
          -(resolution.y / 2) + (Constants.TOPBAR_HEIGHT / 2),
        ),
        size: Vector2(resolution.x, Constants.TOPBAR_HEIGHT.toDouble()),
        match: match,
      ),
    );

    add(
      GridComponent(
        position: Vector2(0, 0),
        size: Vector2(
          Constants.GRID_SIZE.toDouble(),
          Constants.GRID_SIZE.toDouble(),
        ),
        match: match,
      ),
    );

    /*game.camera.viewport.add(
      TimeComponent(
        position: Vector2(100, 100),
        size: Vector2(100, 100),
        match: match,
      ),
    );*/

    /*add(
      TimeComponent(
        position: Vector2(
          0,
          -22,
        ),
        size: Vector2(resolution.x / 25, 50),
        match: match,
      ),
    );*/

    return super.onLoad();
  }
}

mixin MatchComponentRef {
  static late MatchComponent instance;

  MatchComponent get match => instance;
}
