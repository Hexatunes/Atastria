const CHAR_DB = {
    "lullaby": {

        "DISPLAY_NAME" : "Lullaby",

        "BASE_HP" : 120,
        "BASE_STRENGTH" : 50,
        "BASE_MAGIC" : 130,
        "BASE_DEFENCE" : 70,
        "BASE_RESISTENCE" : 80,
        "BASE_SPEED" : 150,

        "ABILITY" : {
            "name": "Apreggio",
            "description": "When Lullaby is > 50% HP, her attack gains +2 bonus hits.",

            onCalculateHitCount: () => {
                return
            }
        },

        "ATTACK" : {
            "name": "Harmonic Dissonance",
            "description": "Standard attack.",
            "stat": "magic",
            "basePower": 45,
            "hits": 1,
            "accuracy": 0.9,
        },

        "TECHNIQUE" : {
            "name": "Soothing Melody",
            "description": "Lullaby sings a soothing melody to an ally, healing the target's hp for 5 turns.",
            "type": "status",
            "stat": "hp",
            "basePower": 80,
            "hits": 1,
            "accuracy": 1,
            "status" : {
                "name": "Soothing Melody",
                "effect": "heal",
                "type": "positive",
                "turns": 5,
            }
        },

        "ULTIMATE" : {
            "name": "Goodnight, Sleep Tight",
            "description": "Lullaby tucks in all allies to bed with a song, healing all members.",
            "side": "ally",
            "target": "all",
            "type": "heal",
            "stat": "hp",
            "basePower": 100,
            "hits": 1,
            "accuracy": 1,
        },
    },

    "xiaoling": {

        "DISPLAY_NAME" : "XiaoLing",

        "BASE_HP" : 60,
        "BASE_STRENGTH" : 170,
        "BASE_MAGIC" : 85,
        "BASE_DEFENCE" : 90,
        "BASE_RESISTENCE" : 100,
        "BASE_SPEED" : 165,

        "ABILITY" : {
            "name": "Revelry of the Undead",
            "description": "Once per battle, XiaoLing will reanimate herself to 50% hp after being fallen.",

            onCalculateHitCount: () => {
                return
            }
        },

        "ATTACK" : {
            "name": "Farewell~!",
            "description": "Standard attack.",
            "stat": "strength",
            "basePower": 120,
            "hits": 1,
            "accuracy": 1,
        },

        "TECHNIQUE" : {
            "name": "Life Cleaning",
            "description": "XiaoLing steals the imanagination of the target, healing herself.",
            "type": "drain",
            "stat": "strength",
            "basePower": 100,
            "hits": 1,
            "accuracy": 1,
        },

        "ULTIMATE" : {
            "name": "Rest in Pieces",
            "description": "Obliterate a single enemy with sheer undead strength.",
            "side": "enemy",
            "target": "single",
            "type": "damage",
            "stat": "strength",
            "basePower": 180,
            "hits": 1,
            "accuracy": 1,
        },
    },

    "lizzy": {

        "DISPLAY_NAME" : "Lizzy",

        "BASE_HP" : 90,
        "BASE_STRENGTH" : 55,
        "BASE_MAGIC" : 175,
        "BASE_DEFENCE" : 120,
        "BASE_RESISTENCE" : 80,
        "BASE_SPEED" : 135,

        "ABILITY" : {
            "name": "The Most Super Duper Reliable Guide Ever",
            "description": "When on field, Lizzy reduces all incoming magic damage to allies by 30%.",

            onCalculateHitCount: () => {
                return
            }
        },

        "ATTACK" : {
            "name": "Shine Forwrds",
            "description": "Standard attack.",
            "stat": "magic",
            "basePower": 60,
            "hits": 1,
            "accuracy": 1,
        },

        "TECHNIQUE" : {
            "name": "Light the Way",
            "description": "Lizzy guides an ally, boosting their resistence for 3 turns",
            "type": "status",
            "stat": "resistence",
            "basePower": 80,
            "hits": 1,
            "accuracy": 1,
            "status": {
                "name": "Light the Way",
                "effect": "resistenceUp",
                "type": "positive",
                "turns": 3,
            }
        },

        "ULTIMATE" : {
            "name": "I'll Ensure Your Safety!",
            "description": "Lizzy casts a protective light over all allies, boosting their resistence for 5 turns.",
            "side": "ally",
            "target": "all",
            "type": "status",
            "stat": "resistence",
            "basePower": 150,
            "status": {
                "name": "I'll Ensure Your Safety!",
                "effect": "resistenceUp",
                "type": "positive",
                "turns": 5,
            }
        },
    },

    "cuddlefish": {

        "DISPLAY_NAME" : "Cuddle Fish",

        "BASE_HP" : 115,
        "BASE_STRENGTH" : 60,
        "BASE_MAGIC" : 85,
        "BASE_DEFENCE" : 195,
        "BASE_RESISTENCE" : 75,
        "BASE_SPEED" : 65,

        "ABILITY" : {
            "name": "Friends Stick Together",
            "description": "When on field, Cuddle Fish reduces all incoming strength damage to allies by 30%.",

            onCalculateHitCount: () => {
                return
            }
        },

        "ATTACK" : {
            "name": "Tail Slap",
            "description": "Standard attack.",
            "stat": "strength",
            "basePower": 60,
            "hits": 1,
            "accuracy": 1,
        },

        "TECHNIQUE" : {
            "name": "Snuggle Shield",
            "description": "Cuddle Fish wraps a protective blanket around an ally, cuddling them and sharply boosting defense for 5 turns.",
            "type": "status",
            "stat": "defence",
            "basePower": 80,
            "hits": 1,
            "accuracy": 1,
            "status": {
                "name": "Snuggle Shield",
                "effect": "defenceUp",
                "type": "positive",
                "turns": 3
            }
        },

        "ULTIMATE" : {
            "name": "Let's Cuddle for Eternity!",
            "description": "Dramatically reduce the speed of all enemies for 3 turns.",
            "side": "enemy",
            "target": "all",
            "type": "status",
            "stat": "defence",
            "basePower": 180,
            "status": {
                "name": "Let's Cuddle for Eternity!",
                "effect": "speedDown",
                "type": "negative",
                "turns": 5
            }
        },
    },

    "syla": {

        "DISPLAY_NAME" : "Syla",

        "BASE_HP" : 130,
        "BASE_STRENGTH" : 10,
        "BASE_MAGIC" : 170,
        "BASE_DEFENCE" : 85,
        "BASE_RESISTENCE" : 65,
        "BASE_SPEED" : 155,

        "ABILITY" : {
            "name": "Knowledge is Power",
            "description": "Syla's recall attacks answered in less than 10 seconds gain a 50% damage increase.",

            onCalculateHitCount: () => {
                return
            }
        },

        "ATTACK" : {
            "name": "Flora Beam",
            "description": "Standard attack.",
            "stat": "magic",
            "basePower": 115,
            "hits": 1,
            "accuracy": 1,
        },

        "TECHNIQUE" : {
            "name": "Critical Analysis",
            "description": "Syla analysizes the weakness of an enemy, lowering their resistence for 3 turns.",
            "type": "status",
            "stat": "magic",
            "basePower": 100,
            "hits": 1,
            "accuracy": 1,
            "status": {
                "name": "Critical Analysis",
                "effect": "resistenceDown",
                "type": "negative",
                "turns": 3
            }
        },

        "ULTIMATE" : {
            "name": "Full Marks of a Genius",
            "description": "Syla barrages all enemies with the power of perfect grades.",
            "side": "enemy",
            "target": "all",
            "type": "damage",
            "stat": "magic",
            "basePower": 50,
            "hits": 10,
            "accuracy": 0.9,
        },
    },

    "toki": {

        "DISPLAY_NAME" : "Toki",

        "BASE_HP" : 110,
        "BASE_STRENGTH" : 60,
        "BASE_MAGIC" : 30,
        "BASE_DEFENCE" : 90,
        "BASE_RESISTENCE" : 65,
        "BASE_SPEED" : 205,

        "ABILITY" : {
            "name": "Smooth Sailing",
            "description": "While on field, allies cannot have their speeds lowered.",

            onCalculateHitCount: () => {
                return
            }
        },

        "ATTACK" : {
            "name": "Cutlass Slash",
            "description": "Standard attack.",
            "stat": "strength",
            "basePower": 80,
            "hits": 1,
            "accuracy": 1,
        },

        "TECHNIQUE" : {
            "name": "Be My First Mate?",
            "description": "The chosen ally becomes Toki's first mate, greatly boosting their speed for 2 turns.",
            "type": "status",
            "stat": "speed",
            "basePower": 100,
            "hits": 1,
            "accuracy": 1,
            "status" : {
                "name": "Be My First Mate?",
                "effect": "speedUp",
                "type": "positive",
                "turns": 2,
            }
        },

        "ULTIMATE" : {
            "name": "Full Speed Ahead!",
            "description": "Toki's sailing boosts the speed of all allies for 3 turns.",
            "side": "ally",
            "target": "all",
            "type": "status",
            "stat": "speed",
            "basePower": 100,
            "hits": 1,
            "accuracy": 1,
            "status" : {
                "name": "Full Speed Ahead!",
                "effect": "speedUp",
                "type": "positive",
                "turns": 3,
            }
        },
    },
}
