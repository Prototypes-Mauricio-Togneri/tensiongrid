import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';

class MatchComponent extends World {
  final Vector2 resolution;
  final Match match;

  MatchComponent({
    required this.resolution,
    required this.match,
  }) {
    MatchComponentRef.instance = this;
  }

  void onTileTapped(TileComponent tileComponent) {
    match.onTileTapped(tileComponent.tile);
  }

  @override
  FutureOr onLoad() {
    add(
      GridComponent(
        position: Vector2(0, 0),
        size: resolution,
        match: match,
        stage: match.stage,
      ),
    );

    return super.onLoad();
  }
}

mixin MatchComponentRef {
  static late MatchComponent instance;

  MatchComponent get match => instance;
}
