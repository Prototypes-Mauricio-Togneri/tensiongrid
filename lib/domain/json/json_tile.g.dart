// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_tile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonTile _$JsonTileFromJson(Map<String, dynamic> json) =>
    $checkedCreate('JsonTile', json, ($checkedConvert) {
      final val = JsonTile(
        id: $checkedConvert('id', (v) => v as String),
        type: $checkedConvert('type', (v) => v as String),
        location: $checkedConvert(
          'location',
          (v) => JsonLocation.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$JsonTileToJson(JsonTile instance) => <String, dynamic>{
  'id': instance.id,
  'type': instance.type,
  'location': instance.location.toJson(),
};
