import random
from typing import List, Tuple

from engine.games.util import without_keys
from engine.models.game import Game, GameLog, GamePlayer
from engine.models.user import UserProfile

def deal_cards(deck:List[str], players:List[GamePlayer], resetScore:bool = False) -> Tuple[List[str], List[GamePlayer]]:
    for player in players:
        player.score = 0 if resetScore else player.score if 'score' in player else 0  # Reset score if needed
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

def player_list(players:List[GamePlayer], game:Game, user:(UserProfile | None)) -> List[dict]:
    playersOut = []

    for player in players:
        gamePlayer = GamePlayer.objects.get(game=game, player=player)
        # Make a copy of the player object that will allow item assignment

        playerOut = {
            'name': player.user.display_name if player.user is not None else player.cpu_name,
            'play_order': gamePlayer.play_order,
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
    players = game.players.all().order_by('gameplayer__order')
    playersOut = player_list(players, game, user)

    gamePlayers = GamePlayer.objects.filter(game=game).all().order_by('order')

    turnPlayer = None if game.turn is None else gamePlayers.get(player=game.turn)
    turnOrder = None if turnPlayer is None else turnPlayer.order

    gameLog = GameLog.objects.filter(game=game).all().order_by('timestamp')
    gameLogOut = []

    for entry in gameLog:
        entryOut = None
        gamePlayer = gamePlayers.get(player=entry.player)

        if entry.action == 'turnover':
            entryOut = {
                'player': entry.player.user.get_username() if entry.player.user is not None else entry.player.cpu_name,
                'action': 'turnover',
                'card': entry.specifics['card'],
                'timestamp': entry.timestamp,
                'turnOrder': gamePlayer.play_order,
            }
        elif entry.action == 'play':
            entryOut = {
                'player': entry.player.user.get_username() if entry.player.user is not None else entry.player.cpu_name,
                'action': 'play',
                'card': entry.specifics['card'],
                'timestamp': entry.timestamp,
                'turnOrder': gamePlayer.play_order,
            }
        elif entry.action == 'wild':
            entryOut = {
                'player': entry.player.user.get_username() if entry.player.user is not None else entry.player.cpu_name,
                'action': 'wild',
                'color': entry.specifics['color'],
                'timestamp': entry.timestamp,
                'turnOrder': gamePlayer.play_order,
            }
        else:
            if entry.action is None:
                continue
            
            entryOut = {
                'player': entry.player.user.get_username() if entry.player.user is not None else entry.player.cpu_name,
                'action': entry.action,
                'timestamp': entry.timestamp,
                'turnOrder': gamePlayer.play_order,
            }
        
        gameLogOut.append(entryOut)

    winner = None

    if game.winner is not None:
        winner = { "user_id": game.winner.id, "name": game.winner.get_username() }
    elif game.cpu_winner is not None:
        winner = { "name": game.cpu_winner }

    output = {
        'id': game.id,
        'starter': { "user_id": game.starter.id, "name": game.starter.get_username() },
        'date_created': game.date_created,
        'date_started': game.date_started,
        'date_finished': game.date_finished,
        'winner': winner,
        'cpu_winner': None if game.cpu_winner is None else { "name": game.cpu_winner },
        'last_move': game.last_move,
        'last_move_ts': game.last_move_ts,
        'players': playersOut,
        'game_log': gameLogOut, 
    }

    if turnOrder:
        output['turn_order'] = turnOrder

    return output | without_keys(game.specifics, ['deck', 'discardPile'])