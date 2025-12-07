import 'dart:async';

class StreamListener {
  StreamSubscription? _subscription;

  void start(StreamSubscription subscription) {
    _subscription = subscription;
  }

  void stop() {
    _subscription?.cancel();
    _subscription = null;
  }
}
