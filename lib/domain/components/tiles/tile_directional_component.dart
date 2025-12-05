import 'dart:async';
import 'package:tensiongrid/domain/components/icon_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/utils/assets.dart';

class TileDirectionalComponent extends TileComponent<TileDirectional> {
  TileDirectionalComponent({
    required super.position,
    required super.size,
    required super.tile,
    required super.gridComponent,
  }) : super(borderColor: tile.direction.color) {
    angle = tile.direction.angle;
  }

  @override
  FutureOr onLoad() async {
    add(
      IconComponent(
        position: size / 2,
        size: size / 2,
        spritePath: Assets.IMAGES_ICONS_ARROW,
        tintColor: tile.direction.color,
      ),
    );

    return super.onLoad();
  }
}
