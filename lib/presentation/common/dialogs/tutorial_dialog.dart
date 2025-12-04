import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/utils/navigation.dart';

class TutorialDialog extends StatelessWidget {
  final String text;
  final VoidCallback? onAccept;

  const TutorialDialog._(this.text, this.onAccept);

  static DialogController show({
    required String text,
    required VoidCallback onAccept,
  }) {
    final BuildContext context = Navigation.context();

    Delayed.post(() {
      showDialog(
        barrierDismissible: false,
        context: context,
        builder: (context) => TutorialDialog._(text, onAccept),
      );
    });

    return DialogController(context);
  }

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
              onAccept?.call();
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
