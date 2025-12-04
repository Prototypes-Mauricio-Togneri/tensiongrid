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
      case EventType.coin:
        return 'Tap it to get points. The sooner you tap it, the more points you get!';
      case EventType.directional:
        return 'Swap it in the direction of the arrow to get points.';
      case EventType.countdown:
        return 'Tap it before the countdown runs out. The closer you are to zero, the more points you get!';
      case EventType.chest:
        return 'Tap it and hold it for 3 seconds to get points.';
      case EventType.bomb:
        return 'Tap it and hold it for 3 seconds to defuse it and avoid losing points.';
      default:
        return '';
    }

    /*
      quantity,
      sequence,
      matching,
      align,
    */
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
