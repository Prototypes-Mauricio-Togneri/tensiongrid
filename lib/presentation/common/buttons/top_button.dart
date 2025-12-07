import 'package:flutter/material.dart';
import 'package:tensiongrid/utils/palette.dart';

class TopButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const TopButton({required this.icon, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: IconButton(
        onPressed: onPressed,
        icon: Icon(icon, color: Palette.ICON_ENABLED),
      ),
    );
  }
}
