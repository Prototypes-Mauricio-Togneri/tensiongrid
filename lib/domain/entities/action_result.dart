class ActionResult {
  final int score;
  final bool soundTap;
  final bool soundError;
  final bool soundEventCompleted;
  final bool removeTile;

  const ActionResult({
    this.score = 0,
    this.soundTap = false,
    this.soundError = false,
    this.soundEventCompleted = false,
    this.removeTile = false,
  });
}
