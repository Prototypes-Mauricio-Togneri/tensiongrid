import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/category.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'json_location.dart';

part 'json_tile.g.dart';

@JsonSerializable()
class JsonTile {
  @JsonKey(name: 'location')
  final JsonLocation location;

  @JsonKey(name: 'direction')
  final Direction? direction;

  @JsonKey(name: 'category')
  final Category? category;

  @JsonKey(name: 'quantity')
  final int? quantity;

  @JsonKey(name: 'number')
  final int? number;

  @JsonKey(name: 'value')
  final String? value;

  const JsonTile({
    required this.location,
    required this.direction,
    required this.category,
    required this.quantity,
    required this.number,
    required this.value,
  });

  Tile get object {
    // TODO(momo): Implement tile deserialization based on type
    throw UnimplementedError();
  }

  factory JsonTile.fromJson(Map<String, dynamic> json) =>
      _$JsonTileFromJson(json);

  Map<String, dynamic> toJson() => _$JsonTileToJson(this);
}
