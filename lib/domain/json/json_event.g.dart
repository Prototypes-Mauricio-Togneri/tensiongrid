// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_event.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonEvent _$JsonEventFromJson(Map<String, dynamic> json) => JsonEvent(
  id: json['id'] as String,
  type: $enumDecode(_$EventTypeEnumMap, json['type']),
  trigger: (json['trigger'] as num).toInt(),
  tiles: (json['tiles'] as List<dynamic>)
      .map((e) => JsonTile.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$JsonEventToJson(JsonEvent instance) => <String, dynamic>{
  'id': instance.id,
  'type': _$EventTypeEnumMap[instance.type]!,
  'trigger': instance.trigger,
  'tiles': instance.tiles,
};

const _$EventTypeEnumMap = {
  EventType.coin: 'coin',
  EventType.directional: 'directional',
  EventType.countdown: 'countdown',
  EventType.chest: 'chest',
  EventType.bomb: 'bomb',
  EventType.quantity: 'quantity',
  EventType.sequence: 'sequence',
  EventType.matching: 'matching',
  EventType.align: 'align',
};
