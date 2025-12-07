import 'package:cloud_firestore/cloud_firestore.dart';

typedef JsonDocument = Map<String, dynamic>;

class Json {
  static JsonDocument object(Map map) {
    final JsonDocument result = <String, dynamic>{};

    for (final MapEntry entry in map.entries) {
      final String key = entry.key.toString();
      final dynamic value = _value(entry.value);

      result[key] = value;
    }

    return result;
  }

  static List<dynamic> array(dynamic list) {
    final List<dynamic> result = [];

    for (final dynamic element in list) {
      result.add(_value(element));
    }

    return result;
  }

  static dynamic _value(dynamic value) {
    if (value is Timestamp) {
      return value.toDate().toIso8601String();
    } else if (value is Map) {
      return object(value);
    } else if (value is List) {
      return array(value);
    } else {
      return value;
    }
  }
}
