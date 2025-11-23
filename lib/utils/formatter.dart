class Formatter {
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
