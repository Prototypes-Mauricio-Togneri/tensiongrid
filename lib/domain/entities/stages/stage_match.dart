import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class StageMatch extends Stage {
  final String category;

  StageMatch({
    required super.id,
    required super.info,
    required super.width,
    required super.height,
    required super.tiles,
    required super.numberOfTiles,
    required this.category,
  });

  @override
  ActionResult onTileTapped(Tile tile) {
    print('Tile tapped at (${tile.x}, ${tile.y})');

    if (tile.category == category) {
      removeTile(tile);

      if (isCompleted) {
        return const ActionResult(
          nextStage: true,
          removeTile: true,
          soundTap: true,
        );
      } else {
        return const ActionResult(
          removeTile: true,
          soundTap: true,
        );
      }
    } else {
      return const ActionResult(
        removeTile: true,
        soundError: true,
      );
    }
  }
}
