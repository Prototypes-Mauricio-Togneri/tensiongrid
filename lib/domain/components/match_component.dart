import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/score_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/topbar_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/utils/dimensions.dart';

class MatchComponent extends World {
  final Vector2 resolution;
  final Match match;
  final MatchState state;
  late final GridComponent gridComponent;

  MatchComponent({
    required this.resolution,
    required this.match,
    required this.state,
  }) {
    MatchComponentRef.instance = this;
  }

  void onTileTapped(TileComponent tileComponent) =>
      gridComponent.onTileTapped(tileComponent);

  @override
  FutureOr onLoad() {
    add(
      TopbarComponent(
        position: Dimensions.topbarPosition(resolution),
        size: Dimensions.topbarSize(resolution),
        match: match,
      ),
    );

    gridComponent = GridComponent(
      position: Vector2.zero(),
      size: Dimensions.gridSize(resolution),
      match: match,
    );

    add(gridComponent);

    add(
      ScoreComponent(
        position: Dimensions.scorePosition(resolution),
        size: Dimensions.scoreSize(resolution),
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
