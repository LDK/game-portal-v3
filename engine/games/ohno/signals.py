# games/ohno/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from engine.models import Game


@receiver(post_save, sender=Game)
def maybe_start_cpu_chain(sender, instance: Game, created, **kwargs):
    # Whenever a game is saved, consider starting the chain.
    # cpu_chain_active flag will keep this safe.
    start_cpu_chain_if_needed(instance)
