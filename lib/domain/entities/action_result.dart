class ActionResult {
  final int score;
  final bool soundTap;
  final bool soundError;
  final bool eventCompleted;
  final bool removeTile;

  const ActionResult({
    this.score = 0,
    this.soundTap = false,
    this.soundError = false,
    this.eventCompleted = false,
    this.removeTile = false,
  });
}
