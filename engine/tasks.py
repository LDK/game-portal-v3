# engine/tasks.py
from huey.contrib.djhuey import task

@task()
def advance_until_human_turn(game_id: int):
    """
    Perform ONE CPU turn for the given game after a delay (handled by scheduling),
    and if it is still a CPU player's turn afterwards, schedule another turn
    in 2.5 seconds.

    Important: we do NOT loop or sleep here. Huey handles the 2.5s pauses
    via .schedule(delay=2.5).
    """
    from engine.models.game import Game  # adjust import to where Game lives
    from engine.games.ohno.logic import cpu_turn

    # Always re-fetch from DB to get fresh state
    # If it's a human turn now, nothing to do
    game = Game.objects.get(pk=game_id)

    if game.current_player.is_human:
        return

    # Do ONE CPU move
    game = cpu_turn(game)
    if hasattr(game, "save"):
        game.save()

    # Re-read in case cpu_turn mutated or saved something else
    game.refresh_from_db()

    # If it's still a CPU player, schedule the *next* CPU move in 2.5 seconds
    if not game.current_player.is_human:
        advance_until_human_turn.schedule(args=(game_id,), delay=2.5)
