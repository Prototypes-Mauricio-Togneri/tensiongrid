import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/character_tile.dart';
import 'package:tensiongrid/domain/entities/tiles/number_tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

abstract class Tile {
  final int x;
  final int y;
  final Color color;

  const Tile({
    required this.x,
    required this.y,
    required this.color,
  });

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  });

  static String numberToCharacter(int number) {
    final int letterIndex = (number - 1) % 26;

    return String.fromCharCode('A'.codeUnitAt(0) + letterIndex);
  }

  static List<Tile> sequenceNumberTiles({
    required int length,
    required int max,
    required NumberType type,
  }) {
    final List<Tile> result = [];
    final List<int> numbers = _generateSequence(
      length: length,
      max: max,
    );

    for (int x = 0; x < Constants.GRID_MAX_WIDTH; x++) {
      for (int y = 0; y < Constants.GRID_MAX_HEIGHT; y++) {
        final int number =
            numbers[(x + 1) + (y * Constants.GRID_MAX_WIDTH) - 1];

        if (number > 0) {
          result.add(
            NumberTile(
              x: x,
              y: y,
              color: Colors.white,
              number: number,
              type: type,
            ),
          );
        }
      }
    }

    return result;
  }

  static List<Tile> characterTiles() {
    final List<Tile> result = [];
    final List<int> numbers = List<int>.generate(
      Constants.GRID_MAX_WIDTH * Constants.GRID_MAX_HEIGHT,
      (index) => index + 1,
    );
    numbers.shuffle();

    for (int x = 0; x < Constants.GRID_MAX_WIDTH; x++) {
      for (int y = 0; y < Constants.GRID_MAX_HEIGHT; y++) {
        final int number =
            numbers[(x + 1) + (y * Constants.GRID_MAX_WIDTH) - 1];

        result.add(
          CharacterTile(
            x: x,
            y: y,
            color: Colors.white,
            value: numberToCharacter(number),
          ),
        );
      }
    }

    return result;
  }

  static List<int> _generateSequence({
    required int length,
    required int max,
  }) {
    final List<int> numbers = List<int>.generate(
      length,
      (index) => (index + 1) <= max ? (index + 1) : 0,
    );
    numbers.shuffle();

    return numbers;
  }
}
