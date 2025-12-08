import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/events/event_align.dart';
import 'package:tensiongrid/domain/entities/events/event_bomb.dart';
import 'package:tensiongrid/domain/entities/events/event_chest.dart';
import 'package:tensiongrid/domain/entities/events/event_coin.dart';
import 'package:tensiongrid/domain/entities/events/event_countdown.dart';
import 'package:tensiongrid/domain/entities/events/event_directional.dart';
import 'package:tensiongrid/domain/entities/events/event_matching.dart';
import 'package:tensiongrid/domain/entities/events/event_quantity.dart';
import 'package:tensiongrid/domain/entities/events/event_sequence.dart';
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
import 'package:tensiongrid/domain/types/event_type.dart';
import 'json_tile.dart';

part 'json_event.g.dart';

@JsonSerializable()
class JsonEvent {
  @JsonKey(name: 'type')
  final EventType type;

  @JsonKey(name: 'trigger')
  final double trigger;

  @JsonKey(name: 'timeout')
  final double timeout;

  @JsonKey(name: 'tiles')
  final List<JsonTile> tiles;

  const JsonEvent({
    required this.type,
    required this.trigger,
    required this.timeout,
    required this.tiles,
  });

  Event get object {
    final List<Tile> tileList = tiles.map((e) => e.object).toList();

    switch (type) {
      case EventType.coin:
        return EventCoin(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileCoin>,
        );
      case EventType.directional:
        return EventDirectional(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileDirectional>,
        );
      case EventType.countdown:
        return EventCountdown(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileCountdown>,
        );
      case EventType.chest:
        return EventChest(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileChest>,
        );
      case EventType.bomb:
        return EventBomb(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileBomb>,
        );
      case EventType.quantity:
        return EventQuantity(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileQuantity>,
        );
      case EventType.sequence:
        return EventSequence(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileSequence>,
        );
      case EventType.matching:
        return EventMatching(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileMatching>,
        );
      case EventType.align:
        return EventAlign(
          trigger: trigger,
          timeout: timeout,
          tiles: tileList as List<TileAlign>,
        );
    }
  }

  factory JsonEvent.fromJson(Map<String, dynamic> json) =>
      _$JsonEventFromJson(json);

  Map<String, dynamic> toJson() => _$JsonEventToJson(this);
}
