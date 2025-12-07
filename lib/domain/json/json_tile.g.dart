// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_tile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonTile _$JsonTileFromJson(Map<String, dynamic> json) => JsonTile(
  id: json['id'] as String,
  type: json['type'] as String,
  location: JsonLocation.fromJson(json['location'] as Map<String, dynamic>),
);

Map<String, dynamic> _$JsonTileToJson(JsonTile instance) => <String, dynamic>{
  'id': instance.id,
  'type': instance.type,
  'location': instance.location,
};
