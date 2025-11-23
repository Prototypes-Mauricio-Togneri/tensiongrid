import 'dart:async';
import 'dart:ui';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/utils/palette.dart';

abstract class TileComponent<T extends Tile> extends PositionComponent
    with TapCallbacks {
  final Paint paintBorderBase = Palette.paint(
    style: PaintingStyle.stroke,
  );
  final Paint paintBorderNeon = Palette.paint(
    style: PaintingStyle.stroke,
    maskFilter: const MaskFilter.blur(BlurStyle.normal, 1),
  );
  final Paint paintBackground = Palette.paint(
    style: PaintingStyle.fill,
  );
  final Match match;
  final T tile;
  late final RRect rect;
  bool isPressed = false;

  TileComponent({
    required super.position,
    required super.size,
    required this.match,
    required this.tile,
  }) : super(anchor: Anchor.center) {
    paintBorderBase.strokeWidth = size.x * 0.02;
    paintBorderBase.color = tile.color.withAlpha(150);

    paintBorderNeon.strokeWidth = size.x * 0.02;
    paintBorderNeon.color = tile.color;

    paintBackground.color = tile.color.withAlpha(20);
  }

  @override
  FutureOr onLoad() {
    rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.x, size.y),
      Radius.circular(size.x * 0.05),
    );

    return super.onLoad();
  }

  @override
  bool onTapDown(TapDownEvent event) {
    isPressed = true;
    return true;
  }

  @override
  bool onTapUp(TapUpEvent event) {
    isPressed = false;
    match.onTileTapped(tile);

    return true;
  }

  @override
  bool onTapCancel(TapCancelEvent event) {
    isPressed = false;
    return true;
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (isPressed) {
      canvas.drawRRect(rect, paintBackground);
      canvas.drawRRect(rect, paintBorderNeon);
    }

    canvas.drawRRect(rect, paintBorderBase);

    /*canvas.drawText(
      text: '${tile.x},${tile.y}',
      position: size / 2,
      size: size.x / 5,
      color: const Color(0xffffffff),
    );*/
  }
}
