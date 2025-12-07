import 'package:tensiongrid/domain/json/json_size.dart';

class Size {
  final int width;
  final int height;

  const Size(this.width, this.height);

  JsonSize get json => JsonSize(
    width: width,
    height: height,
  );

  @override
  bool operator ==(Object other) =>
      other is Size &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => Object.hash(width, height);

  @override
  String toString() => '$width,$height';
}
