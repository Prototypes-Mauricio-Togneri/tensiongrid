// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_tile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonTile _$JsonTileFromJson(Map<String, dynamic> json) =>
    $checkedCreate('JsonTile', json, ($checkedConvert) {
      final val = JsonTile(
        location: $checkedConvert(
          'location',
          (v) => JsonLocation.fromJson(v as Map<String, dynamic>),
        ),
        direction: $checkedConvert(
          'direction',
          (v) => $enumDecodeNullable(_$DirectionEnumMap, v),
        ),
        category: $checkedConvert(
          'category',
          (v) => $enumDecodeNullable(_$CategoryEnumMap, v),
        ),
        quantity: $checkedConvert('quantity', (v) => (v as num?)?.toInt()),
        number: $checkedConvert('number', (v) => (v as num?)?.toInt()),
        value: $checkedConvert('value', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$JsonTileToJson(JsonTile instance) => <String, dynamic>{
  'location': instance.location.toJson(),
  'direction': _$DirectionEnumMap[instance.direction],
  'category': _$CategoryEnumMap[instance.category],
  'quantity': instance.quantity,
  'number': instance.number,
  'value': instance.value,
};

const _$DirectionEnumMap = {
  Direction.up: 'up',
  Direction.down: 'down',
  Direction.left: 'left',
  Direction.right: 'right',
};

const _$CategoryEnumMap = {
  Category.face: 'face',
  Category.animal: 'animal',
  Category.plant: 'plant',
};
