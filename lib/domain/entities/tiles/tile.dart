import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/palette.dart';

abstract class Tile {
  final int x;
  final int y;
  final Color color;
  final String category;

  const Tile({
    required this.x,
    required this.y,
    required this.color,
    required this.category,
  });

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  });

  static List<Tile> sequenceNumberTiles({
    required int width,
    required int height,
    required int max,
    required NumberType type,
  }) {
    final List<Tile> result = [];
    final List<int> numbers = _generateSequence(
      length: width * height,
      max: max,
    );

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        final int index = (x + 1) + (y * width) - 1;
        final int number = numbers[index];

        if (number > 0) {
          result.add(
            TileNumber(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              number: number,
              type: type,
            ),
          );
        } else {
          result.add(
            TileCharacter(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              index: -1,
              value: Formatter.randomCharacter(),
            ),
          );
        }
      }
    }

    return result;
  }

  static List<Tile> sequenceCharacterTiles({
    required int width,
    required int height,
    required int max,
  }) {
    final List<Tile> result = [];
    final List<int> numbers = _generateSequence(
      length: width * height,
      max: max,
    );

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        final int index = (x + 1) + (y * width) - 1;
        final int number = numbers[index];

        if (number > 0) {
          result.add(
            TileCharacter(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              index: number,
              value: Formatter.numberToCharacter(number),
            ),
          );
        } else {
          result.add(
            TileCharacter(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              index: -1,
              value: Formatter.randomDigit(),
            ),
          );
        }
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
