// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_event.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonEvent _$JsonEventFromJson(Map<String, dynamic> json) => $checkedCreate(
  'JsonEvent',
  json,
  ($checkedConvert) {
    final val = JsonEvent(
      type: $checkedConvert('type', (v) => $enumDecode(_$EventTypeEnumMap, v)),
      trigger: $checkedConvert('trigger', (v) => (v as num).toDouble()),
      timeout: $checkedConvert('timeout', (v) => (v as num).toDouble()),
      tiles: $checkedConvert(
        'tiles',
        (v) => (v as List<dynamic>)
            .map((e) => JsonTile.fromJson(e as Map<String, dynamic>))
            .toList(),
      ),
    );
    return val;
  },
);

Map<String, dynamic> _$JsonEventToJson(JsonEvent instance) => <String, dynamic>{
  'type': _$EventTypeEnumMap[instance.type]!,
  'trigger': instance.trigger,
  'timeout': instance.timeout,
  'tiles': instance.tiles.map((e) => e.toJson()).toList(),
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
