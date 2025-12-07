import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:tensiongrid/utils/json.dart';

extension DocumentSnapshotExtension on DocumentSnapshot {
  JsonDocument get json => Json.object(data() as Map);
}
