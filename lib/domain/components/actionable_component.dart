import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:tensiongrid/domain/types/direction.dart';

abstract class ActionableComponent extends PositionComponent
    with TapCallbacks, DragCallbacks {
  Vector2 _dragVector = Vector2.zero();
  bool isPressed = false;
  double _pressedTime = 0;

  ActionableComponent({
    required super.position,
    required super.size,
  }) : super(anchor: Anchor.center);

  @override
  void update(double dt) {
    super.update(dt);

    if (isPressed) {
      _pressedTime += dt;
    }
  }

  @override
  void onTapDown(TapDownEvent event) {
    super.onTapDown(event);
    isPressed = true;
    _pressedTime = 0;
  }

  @override
  void onTapUp(TapUpEvent event) {
    super.onTapUp(event);
    isPressed = false;
    onTileTapped(_pressedTime);
  }

  @override
  void onTapCancel(TapCancelEvent event) {
    super.onTapCancel(event);
    isPressed = false;
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
        onTileSwiped(Direction.right);
      } else {
        onTileSwiped(Direction.left);
      }
    } else {
      if (delta.y > 0) {
        onTileSwiped(Direction.down);
      } else {
        onTileSwiped(Direction.up);
      }
    }
  }

  void onTileTapped(double time);

  void onTileSwiped(Direction direction);
}
