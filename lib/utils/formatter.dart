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

    return '${rounded.toString().padLeft(1, '0')}.${firstDecimal.padLeft(1, '0')}';
  }
}
