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
      return 'A countdown event has started! Reach the target before time runs out to earn extra points. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum';
    } else {
      return '';
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
            const VBox(10),
            Text(_text),
          ],
        ),
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
