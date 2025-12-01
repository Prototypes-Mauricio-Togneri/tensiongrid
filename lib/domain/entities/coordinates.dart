class Coordinates {
  final int x;
  final int y;

  const Coordinates({
    required this.x,
    required this.y,
  });

  @override
  bool operator ==(Object other) =>
      other is Coordinates &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => Object.hash(x, y);

  @override
  String toString() => '($x, $y)';
}
