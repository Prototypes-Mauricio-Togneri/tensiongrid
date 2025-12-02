import 'package:tensiongrid/domain/entities/events/event.dart';

class ActionResult {
  final Event event;
  final int score;
  final bool soundTap;
  final bool soundError;
  final bool eventCompleted;
  final bool removeTile;

  const ActionResult._({
    required this.event,
    required this.score,
    required this.soundTap,
    required this.soundError,
    required this.eventCompleted,
    required this.removeTile,
  });

  factory ActionResult.neutral(Event event) => ActionResult._(
    event: event,
    score: 0,
    soundTap: false,
    soundError: false,
    eventCompleted: false,
    removeTile: false,
  );

  factory ActionResult.completed(Event event) => ActionResult._(
    event: event,
    score: event.pointsSuccess,
    soundTap: true,
    soundError: false,
    eventCompleted: true,
    removeTile: true,
  );

  factory ActionResult.tap(Event event) => ActionResult._(
    event: event,
    score: 0,
    soundTap: true,
    soundError: false,
    eventCompleted: false,
    removeTile: false,
  );

  factory ActionResult.remove(Event event) => ActionResult._(
    event: event,
    score: 0,
    soundTap: true,
    soundError: false,
    eventCompleted: false,
    removeTile: true,
  );

  factory ActionResult.penalty(Event event) => ActionResult._(
    event: event,
    score: -event.pointsFail,
    soundTap: false,
    soundError: true,
    eventCompleted: false,
    removeTile: false,
  );

  factory ActionResult.mistake(Event event) => ActionResult._(
    event: event,
    score: -1,
    soundTap: false,
    soundError: true,
    eventCompleted: false,
    removeTile: false,
  );
}
