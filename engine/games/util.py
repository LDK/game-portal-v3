import random

from engine.models.game import Game

def without_keys(d, keys):
    return {k: d[k] for k in d.keys() - keys}

def get_next_turn_order(game:Game) -> int:
    players = game.players.all().order_by('play_order')
    if not players:
        return 0  # Default to 0 if no players

    max_order = len(players)
    current_order = game.turn_order

    if not game.reverse_order:
        if current_order == max_order:
            return 1  # Wrap around to the first player
        return current_order + 1
    else:
        if current_order == 1:
            return len(players)  # Wrap around to the last player
        return current_order - 1

def get_cpu_name(excluded: list):
    name_list = [
        # Male names
        "James", "John", "Robert", "Michael", "William",
        "David", "Richard", "Joseph", "Thomas", "Charles",
        "Christopher", "Daniel", "Matthew", "Anthony", "Mark",
        "Jimmy", "Steven", "Paul", "Andrew", "Joshua",
        "Kevin", "Brian", "George", "Edward", "Ronald",
        "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob",
        "Gary", "Nicholas", "Eric", "Stephen", "Jonathan",
        "Larry", "Scott", "Frank", "Brandon", "Raymond",
        "Gregory", "Benjamin", "Samuel", "Patrick", "Alexander",
        "Jack", "Dennis", "Jerry", "Tyler", "Aaron",

        # Female names
        "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth",
        "Barbara", "Susan", "Jessica", "Sarah", "Karen",
        "Nancy", "Lisa", "Margaret", "Betty", "Sandra",
        "Ashley", "Dorothy", "Kimberly", "Emily", "Donna",
        "Michelle", "Carol", "Amanda", "Melissa", "Deborah",
        "Stephanie", "Rebecca", "Laura", "Sharon", "Cynthia",
        "Kathleen", "Amy", "Shirley", "Angela", "Helen",
        "Anna", "Brenda", "Pamela", "Nicole", "Emma",
        "Samantha", "Katherine", "Christine", "Debra", "Rachel",
        "Catherine", "Carolyn", "Janet", "Maria", "Heather"
    ]
    randSeed = random.randint(0, len(name_list) - 1)
    chosen = name_list[randSeed]

    if chosen in excluded:
        return get_cpu_name(excluded)
    else:
        return chosen