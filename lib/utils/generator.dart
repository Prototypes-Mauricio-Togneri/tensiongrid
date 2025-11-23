import 'dart:math';
import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/stages/stage_match.dart';
import 'package:tensiongrid/domain/entities/stages/stage_sequence.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_shape.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/domain/types/shape.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/palette.dart';

class StageGenerator {
  final int width;
  final int height;

  const StageGenerator({
    required this.width,
    required this.height,
  });

  Stage matchNumber({
    required String id,
    required int numberOfTiles,
  }) {
    final int digit = Random().nextInt(9) + 1;

    return StageMatch(
      id: id,
      info: 'Match number: $digit',
      width: width,
      height: height,
      tiles: matchNumbersTiles(
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

  Stage matchShape({
    required String id,
    required int numberOfTiles,
  }) {
    final Shape shape = Shape.values[Random().nextInt(Shape.values.length)];

    return StageMatch(
      id: id,
      info: 'Match shape: ${shape.name}',
      width: width,
      height: height,
      tiles: matchShapeTiles(
        width: width,
        height: height,
        numberOfTiles: numberOfTiles,
        shape: shape,
      ),
      numberOfTiles: numberOfTiles,
      category: shape.name,
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
    tiles: sequenceNumberTiles(
      width: width,
      height: height,
      numberOfTiles: numberOfTiles,
      type: type,
    ),
    numberOfTiles: numberOfTiles,
  );

  Stage sequenceCharacter({
    required String id,
    required int numberOfTiles,
  }) => StageSequence(
    id: id,
    info: 'Character sequence',
    width: width,
    height: height,
    tiles: sequenceCharacterTiles(
      width: width,
      height: height,
      max: numberOfTiles,
    ),
    numberOfTiles: numberOfTiles,
  );

  static List<Tile> sequenceNumberTiles({
    required int width,
    required int height,
    required int numberOfTiles,
    required NumberType type,
  }) {
    final List<Tile> result = [];
    final List<int> numbers = _generateSequenceList(
      length: width * height,
      max: numberOfTiles,
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
    final List<int> numbers = _generateSequenceList(
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

  static List<Tile> matchNumbersTiles({
    required int width,
    required int height,
    required int numberOfTiles,
    required int digit,
    required NumberType type,
  }) {
    final List<Tile> result = [];
    final List<bool> list = _generateBooleanList(
      length: width * height,
      max: numberOfTiles,
    );

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        final int index = (x + 1) + (y * width) - 1;

        if (list[index]) {
          result.add(
            TileNumber(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              number: digit,
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
              value: Formatter.similarCharacter(digit),
            ),
          );
        }
      }
    }

    return result;
  }

  static List<Tile> matchShapeTiles({
    required int width,
    required int height,
    required int numberOfTiles,
    required Shape shape,
  }) {
    final List<Tile> result = [];
    final List<bool> list = _generateBooleanList(
      length: width * height,
      max: numberOfTiles,
    );

    for (int x = 0; x < width; x++) {
      for (int y = 0; y < height; y++) {
        final int index = (x + 1) + (y * width) - 1;

        if (list[index]) {
          result.add(
            TileShape(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              shape: shape,
            ),
          );
        } else {
          result.add(
            TileShape(
              x: x,
              y: y,
              color: Palette.TILE_WHITE,
              shape: _otherShape(shape),
            ),
          );
        }
      }
    }

    return result;
  }

  static Shape _otherShape(Shape shape) {
    final List<Shape> otherShapes = Shape.values
        .where((s) => s != shape)
        .toList();
    otherShapes.shuffle();

    return otherShapes.first;
  }

  static List<int> _generateSequenceList({
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

  static List<bool> _generateBooleanList({
    required int length,
    required int max,
  }) {
    final List<bool> numbers = List<bool>.generate(
      length,
      (index) => (index + 1) <= max,
    );
    numbers.shuffle();

    return numbers;
  }
}
