import 'dart:async';
import 'package:flame/components.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/match_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/utils/dimensions.dart';
import 'package:tensiongrid/utils/palette.dart';

class GameComponent extends FlameGame {
  final Match match;
  final MatchState matchState;

  GameComponent({
    required this.match,
    required this.matchState,
  }) {
    GameComponentRef.instance = this;
  }

  @override
  Color backgroundColor() => Palette.TRANSPARENT;

  @override
  FutureOr onLoad() {
    final Vector2 resolution = Dimensions.cameraResolution(canvasSize);
    world = MatchComponent(
      resolution: resolution,
      match: match,
      state: matchState,
    );

    camera = CameraComponent.withFixedResolution(
      width: resolution.x,
      height: resolution.y,
    );

    add(
      FpsTextComponent(
        position: Vector2((canvasSize.x / 2) - 40, canvasSize.y - 40),
        textRenderer: TextPaint(
          style: TextStyle(
            fontSize: canvasSize.x * 0.05,
            color: Palette.TEXT_COLOR_PRIMARY,
          ),
        ),
      ),
    );

    return super.onLoad();
  }
}

mixin GameComponentRef {
  static late GameComponent instance;

  GameComponent get game => instance;
}
