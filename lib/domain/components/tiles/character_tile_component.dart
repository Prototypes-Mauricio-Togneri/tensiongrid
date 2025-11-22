import 'dart:ui';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/character_tile.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';

class CharacterTileComponent extends TileComponent<CharacterTile> {
  CharacterTileComponent({
    required super.position,
    required super.size,
    required super.match,
    required super.tile,
  });

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawText(
      text: tile.value,
      position: size / 2,
      size: size.x / 3,
      color: const Color(0xffffffff),
    );
  }
}
