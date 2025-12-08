import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_align.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_bomb.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_chest.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_matching.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_sequence.dart';
import 'package:tensiongrid/domain/types/category.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
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

  Tile object(Event event) {
    switch (event.type) {
      case EventType.coin:
        return TileCoin(
          location: location.object,
          event: event,
        );
      case EventType.directional:
        return TileDirectional(
          location: location.object,
          event: event,
          direction: direction!,
        );
      case EventType.countdown:
        return TileCountdown(
          location: location.object,
          event: event,
          timeout: event.timeout,
        );
      case EventType.chest:
        return TileChest(
          location: location.object,
          event: event,
        );
      case EventType.bomb:
        return TileBomb(
          location: location.object,
          event: event,
        );
      case EventType.quantity:
        return TileQuantity(
          location: location.object,
          event: event,
          quantity: quantity!,
        );
      case EventType.sequence:
        return TileSequence(
          location: location.object,
          event: event,
          number: number!,
        );
      case EventType.matching:
        return TileMatching(
          location: location.object,
          event: event,
          category: category!,
          value: value!,
        );
      case EventType.align:
        return TileAlign(
          location: location.object,
          event: event,
          direction: direction!,
        );
    }
  }

  factory JsonTile.fromJson(Map<String, dynamic> json) =>
      _$JsonTileFromJson(json);

  Map<String, dynamic> toJson() => _$JsonTileToJson(this);
}
