// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_player.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonPlayer _$JsonPlayerFromJson(Map<String, dynamic> json) =>
    $checkedCreate('JsonPlayer', json, ($checkedConvert) {
      final val = JsonPlayer(
        id: $checkedConvert('id', (v) => v as String),
        index: $checkedConvert('index', (v) => (v as num).toInt()),
        name: $checkedConvert('name', (v) => v as String),
        score: $checkedConvert('score', (v) => (v as num).toInt()),
      );
      return val;
    });

Map<String, dynamic> _$JsonPlayerToJson(JsonPlayer instance) =>
    <String, dynamic>{
      'id': instance.id,
      'index': instance.index,
      'name': instance.name,
      'score': instance.score,
    };
