import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileCountdownComponent extends TileComponent<TileCountdown> {
  late final NeonPaint neonPaint;

  TileCountdownComponent({
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
  bool get showExplosion => true;

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: Formatter.seconds(tile.timeout),
      position: size / 2,
      size: size.x / 2.5,
      paint: neonPaint,
      fontFamily: Constants.FONT_DIGITAL,
    );
  }
}
