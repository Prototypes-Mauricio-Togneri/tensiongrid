import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/utils/navigation.dart';

class TutorialDialog extends StatelessWidget {
  final String type;
  final VoidCallback? onAccept;

  const TutorialDialog._(this.type, this.onAccept);

  static DialogController show({
    required String type,
    required VoidCallback onAccept,
  }) {
    final BuildContext context = Navigation.context();

    print(type);
    print(type.toLowerCase().replaceFirst('event', ''));

    Delayed.post(() {
      showDialog(
        barrierDismissible: false,
        context: context,
        builder: (context) => TutorialDialog._(
          type.toLowerCase().replaceFirst('event', ''),
          onAccept,
        ),
      );
    });

    return DialogController(context);
  }

  String get _text {
    if (type == 'countdown') {
      return 'Tap it before the countdown runs out. The closer you are to zero, the more points you get!';
    } else {
      return 'Missing: $type';
    }
  }

  String get _imagePath => 'assets/images/tutorial/$type.png';

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
