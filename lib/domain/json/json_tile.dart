import 'package:json_annotation/json_annotation.dart';
import 'json_location.dart';

part 'json_tile.g.dart';

@JsonSerializable()
class JsonTile {
  @JsonKey(name: 'id')
  final String id;

  @JsonKey(name: 'type')
  final String type;

  @JsonKey(name: 'location')
  final JsonLocation location;

  const JsonTile({
    required this.id,
    required this.type,
    required this.location,
  });

  factory JsonTile.fromJson(Map<String, dynamic> json) =>
      _$JsonTileFromJson(json);

  Map<String, dynamic> toJson() => _$JsonTileToJson(this);
}
