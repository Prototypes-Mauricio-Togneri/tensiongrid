import 'package:tensiongrid/domain/entities/events/event.dart';

class ActionResult {
  final Event event;
  final int score;
  final bool soundTap;
  final bool soundError;
  final bool eventCompleted;
  final bool removeTile;

  const ActionResult({
    required this.event,
    this.score = 0,
    this.soundTap = false,
    this.soundError = false,
    this.eventCompleted = false,
    this.removeTile = false,
  });
}
