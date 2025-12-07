// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_player.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonPlayer _$JsonPlayerFromJson(Map<String, dynamic> json) => JsonPlayer(
  id: json['id'] as String,
  index: (json['index'] as num).toInt(),
  name: json['name'] as String,
  score: (json['score'] as num).toInt(),
);

Map<String, dynamic> _$JsonPlayerToJson(JsonPlayer instance) =>
    <String, dynamic>{
      'id': instance.id,
      'index': instance.index,
      'name': instance.name,
      'score': instance.score,
    };
