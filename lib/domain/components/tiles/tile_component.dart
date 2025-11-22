import 'dart:async';
import 'dart:ui';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/utils/palette.dart';

abstract class TileComponent extends PositionComponent with TapCallbacks {
  final Paint paintNeutral = Palette.paint(
    style: PaintingStyle.stroke,
  );
  final Paint paintPressed = Palette.paint(
    style: PaintingStyle.stroke,
    maskFilter: const MaskFilter.blur(BlurStyle.normal, 1),
  );
  final Tile tile;
  bool isPressed = false;

  TileComponent({
    required super.position,
    required super.size,
    required this.tile,
  }) : super(anchor: Anchor.center);

  @override
  FutureOr onLoad() {
    paintNeutral.strokeWidth = size.x * 0.03;
    paintNeutral.color = tile.color;

    paintPressed.strokeWidth = size.x * 0.06;
    paintPressed.color = tile.color;

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
      canvas.drawRect(
        Rect.fromLTWH(
          0,
          0,
          size.x,
          size.y,
        ),
        paintPressed,
      );
    }

    canvas.drawRect(
      Rect.fromLTWH(
        0,
        0,
        size.x,
        size.y,
      ),
      paintNeutral,
    );

    /*canvas.drawText(
      text: '${tile.x},${tile.y}',
      position: size / 2,
      size: size.x / 5,
      color: const Color(0xffffffff),
    );*/
  }
}
