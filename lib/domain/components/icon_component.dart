import 'dart:async';
import 'package:flame/components.dart';

class IconComponent extends SpriteComponent {
  final String spritePath;

  IconComponent({
    required super.position,
    required super.size,
    required this.spritePath,
  }) : super(anchor: Anchor.center);

  @override
  FutureOr onLoad() async {
    sprite = await Sprite.load(spritePath);

    return super.onLoad();
  }
}
