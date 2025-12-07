// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonResult _$JsonResultFromJson(Map<String, dynamic> json) => JsonResult(
  id: json['id'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  player1: JsonPlayer.fromJson(json['player1'] as Map<String, dynamic>),
  player2: JsonPlayer.fromJson(json['player2'] as Map<String, dynamic>),
);

Map<String, dynamic> _$JsonResultToJson(JsonResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt.toIso8601String(),
      'player1': instance.player1,
      'player2': instance.player2,
    };
