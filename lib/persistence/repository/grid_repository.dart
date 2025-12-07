import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';
import 'package:tensiongrid/extensions/document_snapshot_extension.dart';
import 'package:tensiongrid/utils/error_handler.dart';

class GridRepository {
  static StreamSubscription listen({
    required String gridId,
    required Function(Grid) onUpdated,
  }) {
    final DocumentReference reference = FirebaseFirestore.instance
        .collection('grid')
        .doc(gridId);

    return reference.snapshots().listen((snapshot) {
      if (snapshot.exists) {
        final JsonGrid jsonGrid = JsonGrid.fromJson(snapshot.json);
        onUpdated(jsonGrid.object);
      }
    }, onError: ErrorHandler.process);
  }
}
