import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class NumberTile extends Tile {
  final int number;

  NumberTile({
    required this.number,
    required super.x,
    required super.y,
    required super.color,
  });
} 