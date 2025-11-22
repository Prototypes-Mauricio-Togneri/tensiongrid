import 'dart:ui';
import 'package:tensiongrid/domain/components/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/number_tile.dart';
import 'package:tensiongrid/domain/types/timeout.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';

class NumberTileComponent extends TileComponent<NumberTile> {
  NumberTileComponent({
    required super.position,
    required super.size,
    required super.tile,
  }) : super();

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (tile.type == NumberType.arabic) {
      canvas.drawText(
        text: '${tile.number}',
        position: size / 2,
        size: size.x / 5,
        color: const Color(0xffffffff),
      );
    } else if (tile.type == NumberType.roman) {
      final String romanNumeral = _toRomanNumeral(tile.number);
      canvas.drawText(
        text: romanNumeral,
        position: size / 2,
        size: size.x / 5,
        color: const Color(0xffffffff),
      );
    }
  }

  String _toRomanNumeral(int number) {
    if (number < 1 || number > 3999) {
      return number.toString(); // Return the number as a string if out of range
    }

    final List<Map<String, dynamic>> romanNumerals = [
      {'value': 1000, 'symbol': 'M'},
      {'value': 900, 'symbol': 'CM'},
      {'value': 500, 'symbol': 'D'},
      {'value': 400, 'symbol': 'CD'},
      {'value': 100, 'symbol': 'C'},
      {'value': 90, 'symbol': 'XC'},
      {'value': 50, 'symbol': 'L'},
      {'value': 40, 'symbol': 'XL'},
      {'value': 10, 'symbol': 'X'},
      {'value': 9, 'symbol': 'IX'},
      {'value': 5, 'symbol': 'V'},
      {'value': 4, 'symbol': 'IV'},
      {'value': 1, 'symbol': 'I'},
    ];

    String result = '';
    int remaining = number;

    for (final Map<String, dynamic> numeral in romanNumerals) {
      while (remaining >= numeral['value']) {
        result += numeral['symbol'];
        remaining -= numeral['value'] as int;
      }
    }

    return result;
  }
}
