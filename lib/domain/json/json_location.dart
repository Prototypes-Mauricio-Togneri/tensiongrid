import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/location.dart';

part 'json_location.g.dart';

@JsonSerializable()
class JsonLocation {
  @JsonKey(name: 'x')
  final int x;

  @JsonKey(name: 'y')
  final int y;

  const JsonLocation({
    required this.x,
    required this.y,
  });

  Location get object => Location(x, y);

  factory JsonLocation.fromJson(Map<String, dynamic> json) =>
      _$JsonLocationFromJson(json);

  Map<String, dynamic> toJson() => _$JsonLocationToJson(this);
}
