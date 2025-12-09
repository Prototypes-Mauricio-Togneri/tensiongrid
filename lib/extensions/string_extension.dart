extension StringExtension on String {
  String get short {
    if (length <= 10) {
      return this;
    } else {
      return '${substring(0, 9)}…';
    }
  }
}
