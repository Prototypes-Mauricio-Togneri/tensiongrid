// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_location.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonLocation _$JsonLocationFromJson(Map<String, dynamic> json) =>
    $checkedCreate('JsonLocation', json, ($checkedConvert) {
      final val = JsonLocation(
        x: $checkedConvert('x', (v) => (v as num).toInt()),
        y: $checkedConvert('y', (v) => (v as num).toInt()),
      );
      return val;
    });

Map<String, dynamic> _$JsonLocationToJson(JsonLocation instance) =>
    <String, dynamic>{'x': instance.x, 'y': instance.y};
