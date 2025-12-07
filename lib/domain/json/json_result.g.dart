// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonResult _$JsonResultFromJson(Map<String, dynamic> json) =>
    $checkedCreate('JsonResult', json, ($checkedConvert) {
      final val = JsonResult(
        id: $checkedConvert('id', (v) => v as String),
        createdAt: $checkedConvert(
          'createdAt',
          (v) => DateTime.parse(v as String),
        ),
        player1: $checkedConvert(
          'player1',
          (v) => JsonPlayer.fromJson(v as Map<String, dynamic>),
        ),
        player2: $checkedConvert(
          'player2',
          (v) => JsonPlayer.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$JsonResultToJson(JsonResult instance) =>
    <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt.toIso8601String(),
      'player1': instance.player1.toJson(),
      'player2': instance.player2.toJson(),
    };
