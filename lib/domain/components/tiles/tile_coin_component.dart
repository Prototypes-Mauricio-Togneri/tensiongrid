import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileCoinComponent extends TileComponent<TileCoin> {
  late final NeonPaint neonPaint;

  TileCoinComponent({
    required super.position,
    required super.size,
    required super.tile,
    required super.gridComponent,
  }) {
    neonPaint = NeonPaint.create(
      color: tile.color,
      style: PaintingStyle.fill,
    );
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: '🪙',
      position: size / 2,
      size: size.x / 2.5,
      paint: neonPaint,
    );
  }
}
