import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
import 'package:tensiongrid/utils/navigation.dart';

class TutorialDialog extends StatelessWidget {
  final EventType type;
  final VoidCallback? onAccept;

  const TutorialDialog._(this.type, this.onAccept);

  static DialogController show({
    required EventType type,
    required VoidCallback onAccept,
  }) {
    final BuildContext context = Navigation.context();

    Delayed.post(() {
      showDialog(
        barrierDismissible: false,
        context: context,
        builder: (context) => TutorialDialog._(
          type,
          onAccept,
        ),
      );
    });

    return DialogController(context);
  }

  String get _text {
    switch (type) {
      case EventType.countdown:
        return 'Tap it before the countdown runs out. The closer you are to zero, the more points you get!';
      default:
        return '';
    }
  }

  String get _imagePath => 'assets/images/tutorial/${type.name}.png';

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: AlertDialog(
        contentPadding: const EdgeInsets.all(25),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(_imagePath),
            const VBox(20),
            Text(_text),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigation.pop();
              onAccept?.call();
            },
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }
}
