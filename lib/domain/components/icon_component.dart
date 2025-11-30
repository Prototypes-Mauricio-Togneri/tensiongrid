import 'dart:async';
import 'dart:ui';
import 'package:flame/components.dart';
import 'package:flame/rendering.dart';

class IconComponent extends SpriteComponent {
  final String spritePath;
  final Color? tintColor;

  IconComponent({
    required super.position,
    required super.size,
    required this.spritePath,
    this.tintColor,
  }) : super(anchor: Anchor.center);

  @override
  FutureOr onLoad() async {
    sprite = await Sprite.load(spritePath);

    if (tintColor != null) {
      final Decorator tint = PaintDecorator.tint(tintColor!);
      decorator.addLast(tint);
    }

    return super.onLoad();
  }
}
