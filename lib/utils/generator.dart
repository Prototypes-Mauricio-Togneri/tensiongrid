import 'dart:math';

import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/stages/stage_match.dart';
import 'package:tensiongrid/domain/entities/stages/stage_sequence.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

class StageGenerator {
  final int width;
  final int height;

  const StageGenerator({
    required this.width,
    required this.height,
  });

  Stage match({
    required String id,
    required int numberOfTiles,
  }) {
    final int digit = Random().nextInt(9) + 1;

    return StageMatch(
      id: id,
      info: 'Match number: $digit',
      width: width,
      height: height,
      tiles: Tile.matchNumbersTiles(
        width: width,
        height: height,
        numberOfTiles: numberOfTiles,
        digit: digit,
        type: NumberType.arabic,
      ),
      numberOfTiles: numberOfTiles,
      category: digit.toString(),
    );
  }

  Stage sequenceNumber({
    required String id,
    required int numberOfTiles,
    required NumberType type,
  }) => StageSequence(
    id: id,
    info: 'Number sequence',
    width: width,
    height: height,
    tiles: Tile.sequenceNumberTiles(
      width: width,
      height: height,
      numberOfTiles: numberOfTiles,
      type: type,
    ),
    numberOfTiles: numberOfTiles,
  );
}
