import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
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

  Tile get object {
    // TODO(momo): Implement tile deserialization based on type
    throw UnimplementedError();
  }

  factory JsonTile.fromJson(Map<String, dynamic> json) =>
      _$JsonTileFromJson(json);

  Map<String, dynamic> toJson() => _$JsonTileToJson(this);
}
