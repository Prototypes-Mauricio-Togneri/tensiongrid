import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';
import 'package:tensiongrid/domain/json/json_size.dart';
import 'package:tensiongrid/extensions/document_snapshot_extension.dart';
import 'package:tensiongrid/persistence/storage/settings_storage.dart';
import 'package:tensiongrid/utils/authentication.dart';

class GridRepository {
  final String userId;
  final String userName;

  const GridRepository._({
    required this.userId,
    required this.userName,
  });

  static Future<GridRepository> instance() async {
    final String name = await SettingsStorage.loadName();

    return GridRepository._(
      userId: Authentication.userId,
      userName: name,
    );
  }

  CollectionReference get _gridCollection =>
      FirebaseFirestore.instance.collection('grid');

  Future<List<Grid>> _grids() async {
    final QuerySnapshot snapshot = await _gridCollection.get();
    final List<Grid> result = [];

    for (final QueryDocumentSnapshot document in snapshot.docs) {
      final JsonGrid jsonGrid = JsonGrid.fromJson(document.json);
      result.add(jsonGrid.object(userId));
    }

    return result;
  }

  Future<Grid> setResult({
    required String gridId,
    required Result? result,
  }) => FirebaseFirestore.instance.runTransaction<Grid>(
    (transaction) async {
      final DocumentReference docRef = _gridCollection.doc(gridId);
      final DocumentSnapshot snapshot = await transaction.get(docRef);
      final JsonGrid jsonGrid = JsonGrid.fromJson(snapshot.json);
      final Grid grid = jsonGrid.object(userId);

      final Result finalResult =
          result ??
          Result.withBot(
            userId: userId,
            userName: userName,
          );
      final Grid updatedGrid = grid.withResult(finalResult);

      transaction.update(docRef, updatedGrid.json.toJson());

      return updatedGrid;
    },
  );

  Future<Grid> search() async {
    final List<Grid> allGrids = await _grids();

    // Never played
    for (final Grid grid in allGrids) {
      if (!grid.playerIds.contains(userId)) {
        return setResult(
          gridId: grid.id,
          result: null,
        );
      }
    }

    // Played but not winner
    for (final Grid grid in allGrids) {
      if ((grid.winnerId != null) && (grid.winnerId != userId)) {
        return setResult(
          gridId: grid.id,
          result: grid.resultFor(userId),
        );
      }
    }

    final DocumentReference docRef = _gridCollection.doc();

    final JsonGrid jsonGrid = JsonGrid(
      id: docRef.id,
      createdAt: DateTime.now(),
      size: const JsonSize(width: 5, height: 5),
      events: [], // TODO(momo): create events
      winnerId: null,
      playerIds: [userId],
      results: [
        Result.withBot(
          userId: userId,
          userName: userName,
        ).json,
      ],
    );

    await docRef.set(jsonGrid.toJson());

    return jsonGrid.object(userId);
  }
}
