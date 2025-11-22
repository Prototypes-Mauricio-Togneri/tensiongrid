import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
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

  @override
  FutureOr onLoad() {
    add(GridComponent(position: resolution / 2, size: resolution));

    return super.onLoad();
  }
}

mixin MatchComponentRef {
  static late MatchComponent instance;

  MatchComponent get match => instance;
}
