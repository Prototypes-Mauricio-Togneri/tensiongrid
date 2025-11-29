import 'dart:async';
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/dimensions.dart';
import 'package:tensiongrid/utils/palette.dart';

class TopbarComponent extends PositionComponent {
  final Match match;

  TopbarComponent({
    required super.position,
    required super.size,
    required this.match,
  }) : super(anchor: Anchor.center);

  @override
  FutureOr onLoad() {
    final Vector2 playerIndicatorSize = Dimensions.playerIndicatorSize(size);

    add(
      PlayerIndicatorComponent(
        position: Dimensions.playerIndicatorPosition(
          containerSize: size,
          indicatorSize: playerIndicatorSize,
          playerIndex: match.player1.index,
        ),
        size: playerIndicatorSize,
        player: match.player1,
      ),
    );

    add(
      PlayerIndicatorComponent(
        position: Dimensions.playerIndicatorPosition(
          containerSize: size,
          indicatorSize: playerIndicatorSize,
          playerIndex: match.player2.index,
        ),
        size: playerIndicatorSize,
        player: match.player2,
      ),
    );

    add(
      TimeComponent(
        position: Dimensions.timePosition(size),
        size: Dimensions.timeSize(size),
        match: match,
      ),
    );

    return super.onLoad();
  }
}

class PlayerIndicatorComponent extends PositionComponent {
  final Player player;
  final Paint paintBorderNeon = Palette.paint(
    style: PaintingStyle.stroke,
    maskFilter: const MaskFilter.blur(BlurStyle.normal, 1),
  );

  PlayerIndicatorComponent({
    required super.position,
    required super.size,
    required this.player,
  }) : super(anchor: Anchor.center) {
    paintBorderNeon.strokeWidth = size.x * 0.02;
    paintBorderNeon.color = player.color;
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.x, size.y),
      paintBorderNeon,
    );
  }
}

class TimeComponent extends PositionComponent {
  final Match match;
  final TextNeonPaint neonPaint = TextNeonPaint.create(
    color: Palette.TEXT_COLOR_PRIMARY,
    style: PaintingStyle.fill,
  );

  TimeComponent({
    required super.position,
    required super.size,
    required this.match,
  }) : super(anchor: Anchor.center);

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: match.elapsedTimeFormatted,
      position: size / 2,
      size: size.x / 5.5,
      paint: neonPaint,
      fontFamily: Constants.FONT_DIGITAL,
    );
  }
}
