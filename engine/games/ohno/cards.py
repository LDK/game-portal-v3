import random
from typing import List, Tuple

from engine.models.game import Game, GameLog

def faceNames() -> dict:
  return {
    's': 'Skip',
    'r': 'Reverse',
    'd': 'Draw Two',
    'd4': 'Draw Four',
    'w': 'Wild',
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  }
def groupNames() -> dict:
  return {
    'r': 'Red',
    'g': 'Green',
    'b': 'Blue',
    'y': 'Yellow',
    'w': 'Wild'
  }
def faceValues() -> dict:
  return {
    's': 20,
    'r': 20,
    'd': 20,
    'd4': 50,
    'w': 50,
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9
  }

def getCardCode(card: dict) -> str:
  # Get group code using groupNames
  group = [key for key, value in groupNames().items() if value == card['group']][0]

  if card['face'] == 'Wild':
    return 'w'
  elif card['face'] == 'Draw Four':
    return 'wd'
  else:
    # Get face code using faceNames
    face = [key for key, value in faceNames().items() if value == card['face']][0]

    return group + face

def cardInfo(code:str) -> dict:
    """
    Get the color and number of a card.
    """

    group = code[0]
    face = code[1] if len(code) > 1 else code[1:]

    if (code == 'wd'):
      face = 'd4'
    elif (code == 'w'):
      face = 'w'

    faceName = faceNames()[face]
    groupName = groupNames()[group]

    card = {
      'group': groupName,
      'face': faceName,
      'short': face.upper(),
      'value': faceValues()[face],
      'name': f'{groupName} {faceName}' if faceName != 'Wild' else f'{faceName} Card'
    }

    effects = ['Skip', 'Reverse', 'Draw Two', 'Draw Four', 'Wild']

    if (faceName in effects):
      card['effect'] = effects[effects.index(faceName)].lower().replace(' ', '-')    

    return card
def init_deck() -> List[str]:
    """
    Initialize the deck for the game.
    """
    deck = []
    for color in ['r', 'g', 'b', 'y']:
        for i in range(10):
            deck.append(f'{color}{i}')
            deck.append(f'{color}{i}')
        deck.append(f'{color}s')
        deck.append(f'{color}s')
        deck.append(f'{color}r')
        deck.append(f'{color}r')
        deck.append(f'{color}d')
        deck.append(f'{color}d')
    for i in range(4):
        deck.append('w')
        deck.append('wd')
    return deck

# Return a new deck, shuffled.
def init_cards() -> Tuple[List[str], List[str], str]:
	deck = init_deck()
	random.shuffle(deck)
	return deck

def turnover_card(game:Game) -> Tuple[List[str], List[str], str]:
    """
    Turn over the top card of the deck to start the discard pile (only at the start of a game/round)
    """
    deck = game.specifics['deck'] if 'deck' in game.specifics else []
    card = deck.pop()

    valid_card = False

    # A game cannot start with a wild draw four
    while valid_card == False:
      if card != 'wd':
        # Rigging for a second...
        card = 'w'
        discard_pile = [card]
        game.specifics['deck'] = deck
        game.specifics['discard_pile'] = discard_pile
        valid_card = True
      else:
        deck.insert(0, card)
        random.shuffle(deck)

    game.save()

    GameLog.objects.create(
      game=game,
      action="to",
      player=game.current_player,
      specifics={"card": cardInfo(card)}
    )

    return deck, discard_pile, card
