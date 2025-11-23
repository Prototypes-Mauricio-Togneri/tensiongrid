import 'dart:math';

import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/stages/stage_match.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

class StageGenerator {
  final int width;
  final int height;

  const StageGenerator({
    required this.width,
    required this.height,
  });

  Stage match(String id) {
    final int digit = Random().nextInt(9) + 1;

    return StageMatch(
      id: id,
      info: 'Match number: $digit',
      width: width,
      height: height,
      tiles: Tile.matchNumbersTiles(
        width: width,
        height: height,
        max: 3,
        digit: digit,
        type: NumberType.arabic,
      ),
      numberOfTiles: 3,
      category: digit.toString(),
    );
  }
}
