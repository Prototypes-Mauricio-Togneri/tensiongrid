class Location {
  final int x;
  final int y;

  const Location(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      other is Location &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => Object.hash(x, y);

  @override
  String toString() => '($x, $y)';
}
