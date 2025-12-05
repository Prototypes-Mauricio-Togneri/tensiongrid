import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/sound.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileCountdownComponent extends TileComponent<TileCountdown> {
  late final NeonPaint neonPaint;
  int lastTime = 0;

  TileCountdownComponent({
    required super.position,
    required super.size,
    required super.tile,
    required super.gridComponent,
  }) : super(borderColor: Palette.TILE_WHITE) {
    neonPaint = NeonPaint.create(
      color: Palette.TILE_WHITE,
      style: PaintingStyle.fill,
    );
    lastTime = tile.timeout.floor();
  }

  @override
  void update(double dt) {
    super.update(dt);

    final double percentage = tile.timeout / tile.event.timeout;
    final Color gradientColor = _getGradientColor(percentage);
    neonPaint.color(gradientColor);
    setBorderColor(gradientColor);

    final int currentTime = tile.timeout.floor();

    if (currentTime != lastTime) {
      lastTime = currentTime;
      Audio.get.playSound(Sound.CLOCK_TICK);
    }
  }

  Color _getGradientColor(double percentage) {
    final double clampedPercentage = percentage.clamp(0, 1);

    if (clampedPercentage <= 0.5) {
      // Interpolate between red (0.0) and orange (0.5)
      final double factor = clampedPercentage / 0.5;
      return Color.lerp(Colors.red, Colors.orange, factor)!;
    } else {
      // Interpolate between orange (0.5) and yellow (1.0)
      final double factor = (clampedPercentage - 0.5) / 0.5;
      return Color.lerp(Colors.orange, Colors.yellow, factor)!;
    }
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
