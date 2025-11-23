import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/types/action_result.dart';

class MatchComponent extends World {
  final Vector2 resolution;
  final Match match;
  late GridComponent currentGrid;

  MatchComponent({
    required this.resolution,
    required this.match,
  }) {
    MatchComponentRef.instance = this;
  }

  void onTileTapped(TileComponent tileComponent) {
    final ActionResult result = match.onTileTapped(tileComponent.tile);

    if (result == ActionResult.remove) {
      tileComponent.removeFromParent();
    } else if (result == ActionResult.next_stage) {
      currentGrid.removeFromParent();
      _addGrid();
    }
  }

  void _addGrid() {
    currentGrid = GridComponent(
      position: Vector2(0, 0),
      size: resolution,
      match: match,
      stage: match.stage,
    );
    add(currentGrid);
  }

  @override
  FutureOr onLoad() {
    _addGrid();

    return super.onLoad();
  }
}

mixin MatchComponentRef {
  static late MatchComponent instance;

  MatchComponent get match => instance;
}
