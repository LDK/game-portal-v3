import random
from typing import List, Tuple

from engine.models.game import Game, GameLog, GamePlayer

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

def getCardCode(card) -> str:
  # Get group code using groupNames
  group = [key for key, value in groupNames().items() if value == card['group']][0]

  if card['face'] == 'Wild':
    return 'w'
  elif card['face'] == 'Draw Four':
    return 'wd4'
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

    if (code == 'wd4'):
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
      'name': f'{groupName} {faceName}'
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
        deck.append('wd4')
    return deck

# Return a new deck, discard pile, and current card
def init_cards(game:Game, player:GamePlayer) -> Tuple[List[str], List[str], str]:
	deck = init_deck()
	random.shuffle(deck)
	current = deck.pop()

	# If the first card is a Draw Four, put it back in the deck and reshuffle
	while (current == 'wd4'):
		deck.insert(0, current)
		random.shuffle(deck)
		current = deck.pop()

	discard_pile = [current]

	GameLog.objects.create(game=game, player=player, action='to', specifics={'card': cardInfo(current)})

	return deck, discard_pile, current