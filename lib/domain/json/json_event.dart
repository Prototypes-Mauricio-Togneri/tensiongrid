import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
import 'json_tile.dart';

part 'json_event.g.dart';

@JsonSerializable()
class JsonEvent {
  @JsonKey(name: 'id')
  final String id;

  @JsonKey(name: 'type')
  final EventType type;

  @JsonKey(name: 'trigger')
  final int trigger;

  @JsonKey(name: 'tiles')
  final List<JsonTile> tiles;

  const JsonEvent({
    required this.id,
    required this.type,
    required this.trigger,
    required this.tiles,
  });

  factory JsonEvent.fromJson(Map<String, dynamic> json) =>
      _$JsonEventFromJson(json);

  Map<String, dynamic> toJson() => _$JsonEventToJson(this);
}
