import 'dart:async';
import 'dart:ui';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:tensiongrid/domain/entities/tile.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileComponent extends PositionComponent with TapCallbacks {
  final Paint paintNeutral = Palette.paint(
    color: const Color(0xffffffff),
    style: PaintingStyle.stroke,
  );
  final Paint paintPressed = Palette.paint(
    color: const Color(0xffffffff),
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
    paintNeutral.strokeWidth = size.x * 0.02;
    paintPressed.strokeWidth = size.x * 0.04;

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

    canvas.drawText(
      text: '${tile.x},${tile.y}',
      position: size / 2,
      size: size.x / 5,
      color: const Color(0xffffffff),
    );
  }
}
