import 'dart:async';
import 'dart:ui';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/utils/palette.dart';

abstract class TileComponent<T extends Tile> extends PositionComponent
    with TapCallbacks, DragCallbacks {
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
  final T tile;
  final GridComponent gridComponent;
  late final RRect rect;
  Vector2 _dragVector = Vector2.zero();
  bool _isPressed = false;
  double _pressedTime = 0;

  TileComponent({
    required super.position,
    required super.size,
    required this.tile,
    required this.gridComponent,
  }) : super(anchor: Anchor.center) {
    paintBorderBase.strokeWidth = size.x * 0.02;
    paintBorderBase.color = tile.color.withAlpha(150);

    paintBorderNeon.strokeWidth = size.x * 0.02;
    paintBorderNeon.color = tile.color;

    paintBackground.color = tile.color.withAlpha(50);
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
  void update(double dt) {
    super.update(dt);

    if (_isPressed) {
      _pressedTime += dt;
    }
  }

  @override
  void onTapDown(TapDownEvent event) {
    super.onTapDown(event);
    _isPressed = true;
    _pressedTime = 0;
  }

  @override
  void onTapUp(TapUpEvent event) {
    super.onTapUp(event);
    _isPressed = false;
    gridComponent.onTileTapped(
      tileComponent: this,
      time: _pressedTime,
    );
  }

  @override
  void onTapCancel(TapCancelEvent event) {
    super.onTapCancel(event);
    _isPressed = false;
  }

  @override
  void onDragStart(DragStartEvent event) {
    super.onDragStart(event);
    _dragVector = Vector2.zero();
  }

  @override
  void onDragUpdate(DragUpdateEvent event) {
    super.onDragUpdate(event);
    _dragVector += event.canvasDelta;
  }

  @override
  void onDragEnd(DragEndEvent event) {
    super.onDragEnd(event);

    if (_dragVector.length > size.x) {
      _handleSwipe(_dragVector);
    }

    _dragVector = Vector2.zero();
  }

  @override
  void onDragCancel(DragCancelEvent event) {
    super.onDragCancel(event);
    _dragVector = Vector2.zero();
  }

  void _handleSwipe(Vector2 delta) {
    final double absX = delta.x.abs();
    final double absY = delta.y.abs();

    if (absX > absY) {
      if (delta.x > 0) {
        gridComponent.onTileSwiped(
          tileComponent: this,
          direction: Direction.right,
        );
      } else {
        gridComponent.onTileSwiped(
          tileComponent: this,
          direction: Direction.left,
        );
      }
    } else {
      if (delta.y > 0) {
        gridComponent.onTileSwiped(
          tileComponent: this,
          direction: Direction.down,
        );
      } else {
        gridComponent.onTileSwiped(
          tileComponent: this,
          direction: Direction.up,
        );
      }
    }
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (_isPressed) {
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
