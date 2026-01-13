from datetime import datetime
import random
from typing import List, Tuple

from engine.games.ohno.cards import cardInfo, getCardCode
from engine.games.ohno.serializers import GameLogSerializer
from engine.games.util import get_next_turn_order, without_keys
from engine.models.game import Game, GameLog, GamePlayer
from engine.models.user import UserProfile

def deal_cards(deck:List[str], players:List[GamePlayer], resetScore:bool = False, dealer:GamePlayer = None) -> Tuple[List[str], List[GamePlayer]]:
	print("Dealing cards to players...", players)
	for player in players:
			print("Dealing to player:", player)
			player.score = 0 if resetScore else player.score if player.score else 0  # Reset score if needed
			player.specifics['cards'] = []
			for i in range(7):
					card = deck.pop()
					player.specifics['cards'].append(card)
			player.save()

	if dealer:
			GameLog.objects.create(
					game=dealer.game,
					action="deal_cards",
					player=dealer
			)

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
	discardPile = game.specifics['discard_pile'] if 'discard_pile' in game.specifics else []

	if len(deck) == 0:
		# Deck is empty, empty the discard pile (minus the top card in the discard pile) and make it the deck
		deck = discardPile[:-1]
		game.specifics['discard_pile'] = [discardPile[-1]]

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
						'is_human': player.is_human,
						'id': player.id
				}
				
				if player.specifics is not None and user is not None and user == player.user:
						cards = player.specifics['cards'] if 'cards' in player.specifics else []
						playerOut['cards'] = cards
				elif player.specifics is not None:
						playerOut['card_count'] = len(player.specifics['cards']) if 'cards' in player.specifics else 0

				playersOut.append(playerOut)

		return playersOut

def get_game_state(game:Game, user:(UserProfile | None)) -> dict:
		players = game.players.all().order_by('play_order')
		print("players", players)
		print("user", user)
		playersOut = player_list(game, user)

		gamePlayers = GamePlayer.objects.filter(game=game).all().order_by('play_order')
		userPlayer = gamePlayers.filter(user=user).first() if user is not None else None

		print("userPlayer", userPlayer)

		turnOrder = game.turn_order

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
				'reverse': game.reverse_order,
				'user_player_id': userPlayer.id if userPlayer is not None else None,
				# 'last_move': game.last_move,
				# 'last_move_ts': game.last_move_ts,
				'players': playersOut,
				'game_log': GameLogSerializer(gameLog, many=True).data
		}

		if turnOrder:
				output['turn_order'] = turnOrder

		return output | without_keys(game.specifics, ['deck', 'discard_pile'])

def handle_card_effect(card:str, game:Game, first_turn:bool = False) -> Tuple[List[GamePlayer], Game]:
		"""
		Handle the effect of a played card, or the turned over card at the start of the game.
		"""
		players = list(game.players.all().order_by('play_order'))

		face = card[1:] if len(card) > 1 else card

		game.specifics['wild'] = False  # Reset wild status
		game.specifics['d4'] = False # Reset draw four status
		target_player = game.next_player

		action = face
		log_action = None

		if len(players) == 2:
				# In a 2-player game, Skip and Reverse have the same effect
				if face == 'r':  # Reverse works like a skip
						action = 's'

		if action not in ['w', 'r', 'd4']:
				game.turn_order = get_next_turn_order(game) # Move to the next player by default

		if action == 's':  # Skip
				log_action = 'skip'
				game.turn_order = get_next_turn_order(game) # Skip the next player's turn

		elif action == 'r':  # Reverse
				log_action = 'reverse'
				game.reverse_order = not game.reverse_order
				game.turn_order = game.next_slot  # Move to the next player in the new order

		elif action == 'd':  # Draw Two
				log_action = 'draw-two'
				# game.turn_order = get_next_turn_order(game) # Move to the next player by default
				next_index = get_next_turn_order(game) # Skip the next player's turn
				for _ in range(2):
					game = draw_card(game, target_player)
				game.turn_order = next_index
	
		elif action == 'w':  # Wild
				# During game-flow, it will be the player playing the card who chooses the color (current player).
				# During the initial card turnover, it will be the player after the dealer (target player).
				wild_player = game.current_player
				if first_turn and wild_player:
						print("First turn wild card, assigning to target player:", wild_player)
						game.turn_order = wild_player.play_order

        # We do not advance the turn order for a wild card. That will be handled after color selection.
				game.specifics['wild'] = True

				if wild_player.is_human:
						GameLog.objects.create(
								game=game,
								player=wild_player,
								action='wild',
								specifics={}
						)

		elif action == 'd4':  # Wild Draw Four
				log_action = 'draw-four'
				game.specifics['wild'] = True
				game.specifics['d4'] = True
				for _ in range(4):
						game = draw_card(game, target_player)
				game.turn_order = get_next_turn_order(game) # Skip the next player's turn
		else:
				# Just a number card, no further action needed
				pass

		print("Game turn order:", game.turn_order)
		game.save()

		if log_action:
				GameLog.objects.create(
						game=game,
						player=target_player,
						action=log_action,
						specifics={
								"card": cardInfo(card)
						}
				)

		return players, game

def color_info(player:GamePlayer) -> Tuple[dict, list]:
		colorPoints = {}
		colorCounts = {}
		colorRanks = []
		
		for card in player.hand:
			card_info = cardInfo(card)
			color = card_info['group']
			value = card_info['value']
			print("Card color:", color, "value:", value)
			colorPoints[color] = colorPoints.get(color, 0) + value
			colorCounts[color] = colorCounts.get(color, 0) + 1

		for color in sorted(colorPoints, key=colorPoints.get, reverse=True):
			colorRanks.append(color)

		print("Color points:", colorPoints)
		print("Color counts:", colorCounts)
		print("Color ranks:", colorRanks)

		return colorPoints, colorRanks, colorCounts

def pass_turn(game:Game, player:GamePlayer) -> Game:
    """
    Pass the turn to the next player.
    """

    game = draw_card(game, player)
    game.turn_order = game.next_slot
    game.save()

    GameLog.objects.create(
        game=game,
        player=player,
        action='pass',
        specifics={}
    )

    return game

def play_card(game:Game, player:GamePlayer, card:str) -> Game:
		"""
		Play a card.
		"""
		top_card = game.specifics['discard_pile'][-1]

		card_info = cardInfo(card)
		top_card_info = cardInfo(top_card)

		print("Playing card:", card_info)
		print("Top card:", top_card_info)

		if card_info['group'] != top_card_info['group'] and card_info['face'] != top_card_info['face'] and card_info['group'] != 'Wild' and not (card_info['group'] == game.specifics['wild_color']):
			return game

		game.specifics['discard_pile'].append(card)
		game.specifics['current_card'] = card

		player.hand.remove(card)

		# A player has won the round if they have no cards left
		if player.hand == []:
			players = game.players.all()
			game.specifics['roundWinner'] = { "user_id": player.user.id if player.user is not None else None, "name": player.cpu_name if player.cpu_name is not None else player.user.get_username() }
			GameLog.objects.create(game=game, player=player, action='round-winner')

			game.turn = None

			points = player.specifics.get('score', 0)
			roundPoints = 0

			for pl in players:
				if pl.user == player.user and player.user is not None:
					continue
        
				plPoints = 0

				for card in pl.hand:
					cInfo = cardInfo(card)
					plPoints += cInfo['value']
					print((pl.user.get_username() if pl.user is not None else pl.cpu_name) + " has cards: ")
					print(pl.hand)
					print("For a total of " + str(plPoints) + " points")
					# pl.specifics['cards'] = []
				pl.save()
				roundPoints += plPoints

			print("Previous points: " + str(points))
			print("Points from this round: " + str(roundPoints))
			print("Total points for" + (
        player.user.get_username() if player.user is not None else player.cpu_name
			) + ": " + str(points + roundPoints))

			points += roundPoints
			player.specifics['score'] = points
			player.save()

			if points >= game.specifics['pointLimit']:
				if player.user is not None:
					game.winner = player.user
				else:
					game.cpu_winner = player.cpu_name
				game.specifics['roundWinner'] = None
				game.date_finished = datetime.now()
				GameLog.objects.create(game=game, player=player, action='v')

			game.save()
			return game
		else:
			game.specifics['roundWinner'] = None
			handle_card_effect(card, game)

		game.save()
		player.save()
		return game

def game_move(game:Game, player:GamePlayer, action:str, card:str, color:(str | None) = None) -> Game:
		"""
		Make a move in the game.
		"""

		print("Game move card:", card)
		print("Color:", color)

		if action == 'pass':
				# GameLog.objects.create(game=game, player=player, action='pass')
				return pass_turn(game, player)

		elif action == 'play':
				if (card is None):
					return game
				
				GameLog.objects.create(game=game, player=player, action='play', specifics={'card': cardInfo(card)})
				return play_card(game, player, card)

		elif action == 'color':
				print("Turn order going into color change:", game.turn_order)
				print("Next slot:", game.next_slot, 'of', len(game.players.all()))
				game.specifics['wild_color'] = color
				game.specifics['wild'] = False # Reset wild status after color is chosen
				game.turn_order = game.next_slot
				game.save()
				print("Card group for color change:", color)
				print("New turn order after color change:", game.turn_order)
				GameLog.objects.create(game=game, player=player, action='color', specifics={'color': color})
				return game

		# elif action == 'next-round':
				# game = next_round(game)
		else:
				return game
    
def cpu_turn(game:Game) -> Game:
		"""
		Make a move for the CPU player.
		"""

		player = game.current_player
		print("CPU turn", player.name, game.id)

		# Get the top card from the discard pile
		top_card = game.specifics['current_card'] if 'current_card' in game.specifics else None

		# If a color has been set via a wild card, get it
		wildColor = game.specifics['wild_color'] if 'wild_color' in game.specifics else None

		# Check if the CPU has a valid move
		valid_moves = []
		topCard = cardInfo(top_card)

		card:(str | None) = None

		print("Wild color", wildColor)

		# Build list of valid moves
		for c in player.hand:
			heldCard = cardInfo(c)
			print("Held card", heldCard)

			if heldCard['group'] == topCard['group'] or heldCard['face'] == topCard['face'] and heldCard['group'] != 'Wild':
				valid_moves.append(c)
			elif game.specifics['wild'] == True and heldCard['group'] == wildColor:
				valid_moves.append(c)

		# Add wild cards to the list of valid moves if no other moves are available
		if len(valid_moves) == 0:
			for c in player.hand:
				heldCard = cardInfo(c)
				if heldCard['group'] == 'Wild':
					valid_moves.append(c)

		colorPoints, colorRanks, colorCounts = color_info(player)
		# Build a list of moves that would change the color
		colorChangeMoves = []

		for color in colorRanks:
			for move in valid_moves:
				if cardInfo(move)['group'] != 'Wild' and cardInfo(move)['group'] != color:
					colorChangeMoves.append(move)

		# See if color can be changed to a higher ranked color
		if cardInfo(top_card)['group'] != colorRanks[0] and len(colorChangeMoves) > 0:
			for move in colorChangeMoves:
				ci = cardInfo(move)
				j = 0

				while j < len(colorRanks):
					if ci['group'] == colorRanks[j]:
						card = move
					j += 1
				
		# Otherwise, play the highest value card
		moveValue = 0

		for move in valid_moves:
				if cardInfo(move)['value'] > moveValue:
					card = move
					break

		if card is None:
			print("No valid moves")
			if game.specifics.get('wild', False) == True:
				game = game_move(game, player, 'color', None, color=colorRanks[0])
			else:
				game = pass_turn(game, player)
		else:
			cInfo = cardInfo(card)

			# If the game is awaiting a Wild choice, change the color to the most common color
			if game.specifics.get('wild', False) == True:
				for color in colorPoints:
					if colorPoints[color] == max(colorPoints.values()):
						if color == 'Wild':
							# If the player has the most points tied up in Wild Cards,
							# then it becomes the best move to play the color with the 
							# fewest cards in hand, to clear a path to using the Wild 
							# cards later.
							new_color = min(colorCounts, key=colorCounts.get)
						else:
							new_color = color
						return game_move(game, player, 'color', None, color=new_color)

			# Pass the turn if no valid moves are available
			game = pass_turn(game, player)

		return game