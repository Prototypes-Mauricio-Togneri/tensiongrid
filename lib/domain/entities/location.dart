import 'dart:math';

import 'package:tensiongrid/domain/entities/size.dart';
import 'package:tensiongrid/domain/json/json_location.dart';

class Location {
  final int x;
  final int y;

  const Location(this.x, this.y);

  JsonLocation get json => JsonLocation(x: x, y: y);

  @override
  bool operator ==(Object other) =>
      other is Location &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => Object.hash(x, y);

  @override
  String toString() => '$x,$y';

  factory Location.random(Size size) {
    final Random random = Random();

    return Location(
      random.nextInt(size.width),
      random.nextInt(size.height),
    );
  }
}
