import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/utils/navigation.dart';
import 'package:tensiongrid/utils/palette.dart';

class ConfirmationDialog extends StatelessWidget {
  final String text;
  final VoidCallback onAccept;
  final VoidCallback? onCancel;

  const ConfirmationDialog._(this.text, this.onAccept, this.onCancel);

  static DialogController _show({
    required String text,
    required VoidCallback onAccept,
    VoidCallback? onCancel,
  }) {
    final BuildContext context = Navigation.context();

    showDialog(
      barrierDismissible: false,
      context: context,
      builder: (context) => ConfirmationDialog._(text, onAccept, onCancel),
    );

    return DialogController(context);
  }

  static DialogController quitMatch(VoidCallback onAccept) =>
      _show(text: 'Do you want to quit the match?', onAccept: onAccept);

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: AlertDialog(
        contentPadding: const EdgeInsets.all(25),
        content: Text(text),
        actions: [
          TextButton(
            onPressed: () {
              Navigation.pop();
              onCancel?.call();
            },
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigation.pop();
              onAccept.call();
            },
            child: const Text(
              'OK',
              style: TextStyle(color: Palette.SEMANTIC_ERROR),
            ),
          ),
        ],
      ),
    );
  }
}
