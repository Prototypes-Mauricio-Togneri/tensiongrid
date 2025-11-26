import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/generator.dart';

class Match {
  final String id;
  final int width;
  final int height;
  final Player player1;
  final Player player2;
  final List<Event> events;
  double elapsedTime = 0;

  Match({
    required this.id,
    required this.width,
    required this.height,
    required this.player1,
    required this.player2,
    required this.events,
  });

  String get elapsedTimeFormatted =>
      Formatter.hoursMinutes(elapsedTime.floor());

  void update(double dt) {
    elapsedTime += dt;
  }

  ActionResult onTileTapped(Tile tile) {
    /*inal ActionResult result = stage.onTileTapped(tile);

    if (result.nextStage) {
      stageIndex++;
    }

    return result;*/
    return const ActionResult();
  }

  factory Match.test() {
    const int width = Constants.GRID_MAX_WIDTH;
    const int height = Constants.GRID_MAX_HEIGHT;

    const EventGenerator generator = EventGenerator(
      width: width,
      height: height,
    );

    return Match(
      id: '123',
      width: width,
      height: height,
      player1: const Player(
        id: '1',
        name: 'Alice',
      ),
      player2: const Player(
        id: '2',
        name: 'Bob',
      ),
      events: [
        generator.eventSequence(
          id: 's0',
          timestamp: 0,
          length: 3,
          type: NumberType.arabic,
        ),
      ],
    );
  }
}
