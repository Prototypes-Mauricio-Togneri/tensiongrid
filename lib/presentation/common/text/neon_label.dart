import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';

class NeonLabel extends StatelessWidget {
  final String text;
  final Color color;
  final double size;
  final FontWeight? weight;
  final TextDecoration? decoration;
  final TextAlign? align;
  final TextOverflow? overflow;
  final int? maxLines;
  final double glowRadius;

  const NeonLabel({
    required this.text,
    required this.color,
    required this.size,
    this.weight,
    this.decoration,
    this.align,
    this.overflow,
    this.maxLines,
    this.glowRadius = 4,
  });

  /*@override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Text(
          text,
          textAlign: align,
          maxLines: maxLines,
          style: TextStyle(
            color: color,
            fontSize: size,
            fontWeight: weight,
            decoration: decoration,
            overflow: overflow,
          ),
        ),
        Text(
          text,
          textAlign: align,
          maxLines: maxLines,
          style: TextStyle(
            fontSize: size,
            fontWeight: weight,
            decoration: decoration,
            overflow: overflow,
            foreground: Paint()
              ..style = PaintingStyle.fill
              ..color = color
              ..maskFilter = MaskFilter.blur(BlurStyle.normal, glowRadius),
          ),
        ),
      ],
    );*/

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: align,
      maxLines: maxLines,
      style: TextStyle(
        fontFamily: Constants.FONT_MICHROMA,
        color: color,
        fontSize: size,
        fontWeight: weight,
        decoration: decoration,
        overflow: overflow,
        shadows: [
          // Outer glow - largest radius
          Shadow(
            color: color.withAlpha(204),
            blurRadius: glowRadius,
            offset: Offset.zero,
          ),
          // Middle glow
          Shadow(
            color: color.withAlpha(230),
            blurRadius: glowRadius * 0.6,
            offset: Offset.zero,
          ),
          // Inner glow - brightest
          Shadow(
            color: color,
            blurRadius: glowRadius * 0.3,
            offset: Offset.zero,
          ),
          // Core highlight
          Shadow(
            color: color.withAlpha(204),
            blurRadius: glowRadius * 0.1,
            offset: Offset.zero,
          ),
        ],
      ),
    );
  }
}
