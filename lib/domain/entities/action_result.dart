import 'package:tensiongrid/domain/entities/events/event.dart';

class ActionResult {
  final Event event;
  final int score;
  final bool soundTap;
  final bool soundError;
  final bool eventCompleted;
  final bool removeTile;

  // TODO(momo): make private and use only factory constructors
  const ActionResult({
    required this.event,
    this.score = 0,
    this.soundTap = false,
    this.soundError = false,
    this.eventCompleted = false,
    this.removeTile = false,
  });

  factory ActionResult.neutral(Event event) => ActionResult(event: event);

  factory ActionResult.tap(Event event) => ActionResult(
    event: event,
    soundTap: true,
  );

  factory ActionResult.remove(Event event) => ActionResult(
    event: event,
    soundTap: true,
    removeTile: true,
  );

  factory ActionResult.completed(Event event) => ActionResult(
    event: event,
    score: event.pointsSuccess,
    eventCompleted: true,
    removeTile: true,
    soundTap: true,
  );

  factory ActionResult.penalty(Event event) => ActionResult(
    event: event,
    score: -event.pointsFail,
    soundError: true,
  );

  factory ActionResult.mistake(Event event) => ActionResult(
    event: event,
    score: -1,
    soundError: true,
  );
}
