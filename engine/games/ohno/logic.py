import random
from typing import List, Tuple

from engine.games.ohno.serializers import GameLogSerializer
from engine.games.util import without_keys
from engine.models.game import Game, GameLog, GamePlayer
from engine.models.user import UserProfile

def deal_cards(deck:List[str], players:List[GamePlayer], resetScore:bool = False) -> Tuple[List[str], List[GamePlayer]]:
    print("Dealing cards to players...", players)
    for player in players:
        print("Dealing to player:", player)
        player.score = 0 if resetScore else player.score if player.score else 0  # Reset score if needed
        player.specifics['cards'] = []
        for i in range(7):
            card = deck.pop()
            player.specifics['cards'].append(card)
        player.save()
    
    return deck, players

def user_players(players:List[GamePlayer]) -> List[GamePlayer]:
    """
    Get the players that are users.
    """
    return [player for player in players if player.is_human]

def draw_card(game:Game, player:GamePlayer) -> Game:
    """
    Draw a card from the deck.
    """

    deck = game.specifics['deck'] if 'deck' in game.specifics else []
    discardPile = game.specifics['discardPile'] if 'discardPile' in game.specifics else []

    if len(deck) == 0:
        # Deck is empty, empty the discard pile (minus the top card in the discard pile) and make it the deck
        deck = discardPile[:-1]
        game.specifics['discardPile'] = [discardPile[-1]]

        # Shuffle deck
        random.shuffle(deck)
        game.specifics['deck'] = deck
        game.save()

    card = deck.pop()
    player.specifics['cards'].append(card)
    player.save()

    return game

def player_list(game:Game, user:(UserProfile | None)) -> List[dict]:
    playersOut = []

    for player in game.players.all().order_by('play_order'):
        # Make a copy of the player object that will allow item assignment

        playerOut = {
            'name': player.user.display_name if player.user is not None else player.cpu_name,
            'play_order': player.play_order,
            'score': player.score,
            'user_profile_id': player.user.id if player.user is not None else None,
            'is_human': player.is_human
        }
        
        if player.specifics is not None and user is not None and user == player.user:
            cards = player.specifics['cards'] if 'cards' in player.specifics else {}
            playerOut['cards'] = cards
        elif player.specifics is not None:
            playerOut['card_count'] = len(player.specifics['cards']) if 'cards' in player.specifics else 0

        playersOut.append(playerOut)

    return playersOut

def get_game_state(game:Game, user:(UserProfile | None)) -> dict:
    players = game.players.all().order_by('play_order')
    print("players", players)
    playersOut = player_list(game, user)

    gamePlayers = GamePlayer.objects.filter(game=game).all().order_by('play_order')

    turnPlayer = game.current_player or None
    turnOrder = None if turnPlayer is None else turnPlayer.play_order

    gameLog = GameLog.objects.filter(game=game).all().order_by('timestamp')
    winner = None

    if len(game.winners) > 0:
        winner = { "user_id": game.winners[0].id, "name": game.winners[0].display_name if game.winners[0].is_human else game.winners[0].cpu_name }

    output = {
        'id': game.id,
        'starter': { "user_id": game.starter.id, "name": game.starter.display_name },
        'created_at': game.created_at,
        'started_at': game.started_at,
        'ended_at': game.ended_at,
        'winner': winner,
        'max_players': game.max_players,
        'invite_only': game.invite_only,
        'round': game.round,
        'reverse': game.specifics.get('reverse_order', False),        
        # 'last_move': game.last_move,
        # 'last_move_ts': game.last_move_ts,
        'players': playersOut,
        'game_log': GameLogSerializer(gameLog, many=True).data
    }

    if turnOrder:
        output['turn_order'] = turnOrder

    return output | without_keys(game.specifics, ['deck', 'discardPile'])