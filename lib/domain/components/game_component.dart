import 'dart:async';
import 'package:flame/components.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/match_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
import 'package:tensiongrid/environments/environment.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/music.dart';
import 'package:tensiongrid/presentation/common/dialogs/tutorial_dialog.dart';
import 'package:tensiongrid/utils/dimensions.dart';
import 'package:tensiongrid/utils/palette.dart';

class GameComponent extends FlameGame {
  final Match match;
  final MatchState state;

  GameComponent({
    required this.match,
    required this.state,
  }) {
    GameComponentRef.instance = this;
  }

  @override
  Color backgroundColor() => Palette.TRANSPARENT;

  @override
  FutureOr onLoad() {
    Audio.get.playMusic(Music.MUSIC);

    final Vector2 resolution = Dimensions.cameraResolution(canvasSize);

    world = MatchComponent(
      resolution: resolution,
      match: match,
    );

    camera = CameraComponent.withFixedResolution(
      width: resolution.x,
      height: resolution.y,
    );

    add(
      FpsTextComponent(
        position: Dimensions.fpsPosition(canvasSize),
        textRenderer: TextPaint(
          style: TextStyle(
            fontSize: canvasSize.x * 0.04,
            color: Palette.TEXT_COLOR_PRIMARY,
          ),
        ),
      ),
    );

    return super.onLoad();
  }

  @override
  void onDetach() {
    Audio.get.stopMusic();
  }

  @override
  void update(double dt) {
    super.update(dt);

    if (match.isFinished) {
      pauseEngine();
      state.onMatchFinished();
    }
  }

  void showTutorial(EventType type) {
    if (!Environment.get.isRelease) {
      pauseEngine();

      TutorialDialog.show(
        type: type,
        onAccept: resumeEngine,
      );
    }
  }
}

mixin GameComponentRef {
  static late GameComponent instance;

  GameComponent get game => instance;
}
