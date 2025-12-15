import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
import 'package:tensiongrid/presentation/common/text/label.dart';
import 'package:tensiongrid/utils/navigation.dart';
import 'package:tensiongrid/utils/palette.dart';

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
        return 'Tap to get points. The faster you tap, the more points you earn.';
      case EventType.directional:
        return 'Swipe in the direction of the arrow to get points.';
      case EventType.countdown:
        return 'Tap to stop the countdown. The closer to zero you stop it, the more points you get.';
      case EventType.chest:
        return 'Tap and hold for 3 seconds to get points.';
      case EventType.bomb:
        return 'Tap and hold for 3 seconds to defuse the tile and avoid losing points.';
      case EventType.quantity:
        return 'Tap the tile the number of times shown to get points.';
      case EventType.sequence:
        return 'Tap them in the correct sequential order to get points.';
      case EventType.matching:
        return 'Tap the tiles belonging to the largest group to get points.';
      case EventType.align:
        return 'Tap to rotate the arrows 90º and align them all to get points.';
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
            Label(
              text: _text,
              color: Palette.TEXT_COLOR_SECONDATY,
              size: 16,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigation.pop();
              onAccept?.call();
            },
            child: const Label(
              text: 'Continue',
              color: Palette.PRIMARY,
              size: 16,
            ),
          ),
        ],
      ),
    );
  }
}
