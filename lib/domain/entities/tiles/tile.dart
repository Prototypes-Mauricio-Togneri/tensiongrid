import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/tiles/character_tile.dart';
import 'package:tensiongrid/domain/entities/tiles/number_tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

abstract class Tile {
  final int x;
  final int y;
  final Color color;
  final Match match;

  const Tile({
    required this.x,
    required this.y,
    required this.color,
    required this.match,
  });

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  });

  static String _numberToCharacter(int number) {
    final int letterIndex = (number - 1) % 26;

    return String.fromCharCode('A'.codeUnitAt(0) + letterIndex);
  }

  static String _numberToVisualCharacter(int number) {
    const Map<int, String> visualMap = {
      0: 'O',
      1: 'I',
      2: 'Z',
      3: 'E',
      4: 'A',
      5: 'S',
      6: 'G',
      7: 'T',
      8: 'B',
      9: 'H',
    };

    String result = '';
    final String numberString = number.toString();

    for (int i = 0; i < numberString.length; i++) {
      final int digit = int.parse(numberString[i]);
      result += visualMap[digit] ?? digit.toString();
    }

    return result;
  }

  static List<Tile> sequenceNumberTiles({
    required Match match,
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
            NumberTile(
              x: x,
              y: y,
              color: Colors.white,
              number: number,
              type: type,
              match: match,
            ),
          );
        } else {
          result.add(
            CharacterTile(
              x: x,
              y: y,
              color: Colors.white,
              value: _numberToVisualCharacter(index),
              match: match,
            ),
          );
        }
      }
    }

    return result;
  }

  static List<Tile> sequenceCharacterTiles({
    required Match match,
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
        final int number = numbers[(x + 1) + (y * width) - 1];

        result.add(
          CharacterTile(
            x: x,
            y: y,
            color: Colors.white,
            value: _numberToCharacter(number),
            match: match,
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
