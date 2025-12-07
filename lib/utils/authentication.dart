import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/widgets.dart';
import 'package:tensiongrid/utils/error_handler.dart';

class Authentication {
  static User? get currentUser => FirebaseAuth.instance.currentUser;

  static String get userId => currentUser?.uid ?? '';

  static void checkIfAuthenticated({
    required Function(User) onSuccess,
    required VoidCallback onError,
  }) {
    final Stream<User?> stream = FirebaseAuth.instance.authStateChanges();
    StreamSubscription? subscription;
    subscription = stream.listen((user) async {
      await subscription?.cancel();

      if (user != null) {
        try {
          await user.reload();
          onSuccess(user);
        } catch (e) {
          await ErrorHandler.process(e);

          onError();
        }
      } else {
        onError();
      }
    });
  }

  static Future<User> signInAnonymously() async {
    try {
      final UserCredential credential = await FirebaseAuth.instance
          .signInAnonymously();
      return credential.user!;
    } catch (e) {
      await ErrorHandler.process(e);
      rethrow;
    }
  }
}
