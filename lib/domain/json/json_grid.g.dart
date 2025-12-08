// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_grid.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonGrid _$JsonGridFromJson(Map<String, dynamic> json) =>
    $checkedCreate('JsonGrid', json, ($checkedConvert) {
      final val = JsonGrid(
        id: $checkedConvert('id', (v) => v as String),
        createdAt: $checkedConvert(
          'createdAt',
          (v) => DateTime.parse(v as String),
        ),
        size: $checkedConvert(
          'size',
          (v) => JsonSize.fromJson(v as Map<String, dynamic>),
        ),
        timeout: $checkedConvert('timeout', (v) => (v as num).toInt()),
        events: $checkedConvert(
          'events',
          (v) => (v as List<dynamic>)
              .map((e) => JsonEvent.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
        winnerId: $checkedConvert('winnerId', (v) => v as String?),
        playerIds: $checkedConvert(
          'playerIds',
          (v) => (v as List<dynamic>).map((e) => e as String).toList(),
        ),
        results: $checkedConvert(
          'results',
          (v) => (v as List<dynamic>)
              .map((e) => JsonResult.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
      );
      return val;
    });

Map<String, dynamic> _$JsonGridToJson(JsonGrid instance) => <String, dynamic>{
  'id': instance.id,
  'createdAt': instance.createdAt.toIso8601String(),
  'size': instance.size.toJson(),
  'timeout': instance.timeout,
  'events': instance.events.map((e) => e.toJson()).toList(),
  'winnerId': instance.winnerId,
  'playerIds': instance.playerIds,
  'results': instance.results.map((e) => e.toJson()).toList(),
};
