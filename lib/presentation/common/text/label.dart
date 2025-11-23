import 'package:flutter/material.dart';

class Label extends StatelessWidget {
  final String text;
  final Color color;
  final double size;
  final FontWeight? weight;
  final TextDecoration? decoration;
  final TextAlign? align;
  final TextOverflow? overflow;
  final int? maxLines;
  final Paint? foreground;

  const Label({
    required this.text,
    required this.color,
    required this.size,
    this.weight,
    this.decoration,
    this.align,
    this.overflow,
    this.maxLines,
    this.foreground,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: align,
      maxLines: maxLines,
      style: TextStyle(
        color: color,
        fontSize: size,
        fontWeight: weight,
        decoration: decoration,
        overflow: overflow,
        foreground: foreground,
      ),
    );
  }
}
