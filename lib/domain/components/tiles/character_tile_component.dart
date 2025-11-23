import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/character_tile.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class CharacterTileComponent extends TileComponent<CharacterTile> {
  final Paint paintBase = Palette.paint(
    style: PaintingStyle.fill,
  );
  final Paint paintNeon = Palette.paint(
    style: PaintingStyle.fill,
    maskFilter: const MaskFilter.blur(BlurStyle.normal, 1),
  );

  CharacterTileComponent({
    required super.position,
    required super.size,
    required super.match,
    required super.tile,
  }) {
    paintBase.color = tile.color;
    paintNeon.color = tile.color;
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawText(
      text: tile.value,
      position: size / 2,
      size: size.x / 3,
      foreground: paintNeon,
    );

    canvas.drawText(
      text: tile.value,
      position: size / 2,
      size: size.x / 3,
      foreground: paintBase,
    );
  }
}
