import 'dart:async';
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/extensions/string_extension.dart';
import 'package:tensiongrid/utils/dimensions.dart';
import 'package:tensiongrid/utils/formatter.dart';
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
  late final Paint paintBackground;
  late final NeonPaint paintBorder;
  late final NeonPaint paintText;
  late final RRect rect;
  late final Vector2 textPosition;

  PlayerIndicatorComponent({
    required super.position,
    required super.size,
    required this.player,
  }) : super(anchor: Anchor.center) {
    paintBackground = Palette.paint(
      style: PaintingStyle.fill,
      color: player.color.withAlpha(50),
    );
    paintBorder = NeonPaint.create(
      color: player.color,
      style: PaintingStyle.stroke,
      strokeWidth: size.x * 0.01,
    );
    paintText = NeonPaint.create(
      color: Palette.TEXT_COLOR_PRIMARY,
      style: PaintingStyle.fill,
    );
    rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.x, size.y),
      Radius.circular(size.x / 30),
    );
    textPosition = Dimensions.playerNamePosition(
      size: size,
      playerIndex: player.index,
    );
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawRectNeon(
      rect: rect,
      paint: paintBorder,
    );

    canvas.drawRRect(
      rect,
      paintBackground,
    );

    canvas.drawTextNeon(
      text: player.name.short.toUpperCase(),
      position: textPosition,
      size: size.x / 12,
      paint: paintText,
      fontFamily: Constants.FONT_MICHROMA,
      anchor: player.index == Constants.PLAYER_1
          ? Anchor.centerLeft
          : Anchor.centerRight,
    );
  }
}

class TimeComponent extends PositionComponent {
  final Match match;
  final NeonPaint neonPaint = NeonPaint.create(
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
      text: Formatter.hoursMinutes(match.remainingTime),
      position: Vector2(
        size.x / 2,
        size.y * 0.65,
      ),
      size: size.x / 6,
      paint: neonPaint,
      fontFamily: Constants.FONT_DIGITAL,
    );
  }
}
