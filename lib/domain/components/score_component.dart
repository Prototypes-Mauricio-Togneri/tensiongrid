import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class ScoreComponent extends PositionComponent {
  final Match match;
  final NeonPaint neonPaint = NeonPaint.create(
    color: Palette.TEXT_COLOR_PRIMARY,
    style: PaintingStyle.fill,
  );

  ScoreComponent({
    required super.position,
    required super.size,
    required this.match,
  }) : super(anchor: Anchor.center);

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: match.score.toString(),
      position: size / 2,
      size: size.x / 8,
      paint: neonPaint,
      fontFamily: Constants.FONT_MICHROMA,
    );
  }
}
