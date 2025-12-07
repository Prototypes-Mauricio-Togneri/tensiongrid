import 'package:flutter/material.dart';
import 'package:tensiongrid/presentation/common/text/label.dart';
import 'package:tensiongrid/utils/palette.dart';

class PrimaryButton extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final bool enabled;
  final VoidCallback onPressed;
  final double fontSize;
  final double height;
  final bool fullWidth;

  const PrimaryButton({
    required this.label,
    required this.enabled,
    required this.backgroundColor,
    required this.onPressed,
    this.fontSize = 18,
    this.height = 40,
    this.fullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: height,
      child: ElevatedButton(
        onPressed: enabled ? onPressed : null,
        style: ButtonStyle(
          foregroundColor: WidgetStateProperty.resolveWith<Color>(
            (states) => Palette.TEXT_COLOR_PRIMARY,
          ),
          backgroundColor: WidgetStateProperty.resolveWith<Color>((states) {
            if (states.contains(WidgetState.disabled)) {
              return Palette.BUTTON_DISABLED;
            } else {
              return backgroundColor;
            }
          }),
          textStyle: WidgetStateProperty.all<TextStyle>(
            TextStyle(fontSize: fontSize),
          ),
          padding: WidgetStateProperty.all<EdgeInsets>(
            const EdgeInsets.only(
              left: 20,
              right: 20,
              bottom: 10,
              top: 0,
            ),
          ),
        ),
        child: Label(
          text: label.toUpperCase(),
          color: Palette.TEXT_COLOR_PRIMARY,
          size: fontSize,
        ),
      ),
    );
  }
}
