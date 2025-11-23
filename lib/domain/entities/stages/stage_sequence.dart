import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class StageSequence extends Stage {
  const StageSequence({
    required super.id,
    required super.info,
    required super.width,
    required super.height,
    required super.tiles,
  });

  @override
  void onTileTapped(Tile tile) {
    print('Tile tapped at (${tile.x}, ${tile.y})');
  }
}
