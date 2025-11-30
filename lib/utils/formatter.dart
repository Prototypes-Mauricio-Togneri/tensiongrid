import 'dart:math';

class Formatter {
  static String hoursMinutes(int seconds) {
    final int minutes = seconds ~/ 60;
    final int remainingSeconds = seconds % 60;

    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  static String seconds(double seconds) {
    final int rounded = seconds.floor();
    final double rest = (seconds - rounded) * 10;
    final String firstDecimal = rest.toString()[0];

    return '${rounded.toString().padLeft(1, '0')}:${firstDecimal.padLeft(1, '0')}';
  }

  static String numberToCharacter(int number) {
    final int letterIndex = (number - 1) % 26;

    return String.fromCharCode('A'.codeUnitAt(0) + letterIndex);
  }

  static String randomDigit() {
    final int digit = Random().nextInt(9) + 1;

    return digit.toString();
  }

  static String randomCharacter() {
    final int digit = Random().nextInt(9) + 1;

    return similarCharacter(digit);
  }

  static String similarCharacter(int digit) {
    const Map<int, String> visualMap = {
      1: 'I',
      2: 'Z',
      3: 'E',
      4: 'A',
      5: 'S',
      6: 'G',
      7: 'T',
      8: 'B',
      9: 'g',
    };

    return visualMap[digit] ?? digit.toString();
  }

  static String toRomanNumeral(int number) {
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
