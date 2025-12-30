export const INITIAL_GAMES = [
  {
    id: 1,
    name: "Cup Knockdown",
    brief: "Individual players try to score by knocking down the cups stacked like a pyramid.",
    rules: [
      "Stack cups in a pyramid formation.",
      "Players get a set number of throws.",
      "Knock down as many cups as possible.",
      "Score is based on the number of cups down."
    ],
    scoring: "10 Points per cup knocked down. +50 Bonus for clearing all.",
    active: true,
    theme: "from-orange-400 to-red-400",
    icon: "🎯",
    type: "INDIVIDUAL"
  },
  {
    id: 2,
    name: "Ping Pong Cup Toss",
    brief: "Individual players try to toss the ball into the cups marked with different scores.",
    rules: [
      "Cups are marked with scores (e.g., 10, 20, 50).",
      "Stand at the marked line.",
      "Toss the ball into the cups.",
      "You have 3 Chances."
    ],
    scoring: "Points equal to the value written on the cup (10/20/50).",
    active: true,
    theme: "from-blue-400 to-indigo-400",
    icon: "🏓",
    type: "INDIVIDUAL"
  },
  {
    id: 3,
    name: "Cup Pyramid Challenge",
    brief: "Individual Players try to build a pyramid out of cups against time.",
    rules: [
      "Start with a stack of 10-15 cups.",
      "Build a stable pyramid as fast as possible.",
      "Pyramid must stand for 3 seconds.",
      "Time limit: 1 Minute."
    ],
    scoring: "50 Points for completing under 30s. 30 Points -> under 45s. 10 Points -> under 60s.",
    active: true,
    theme: "from-emerald-400 to-teal-500",
    icon: "🏗️",
    type: "INDIVIDUAL"
  },
  {
    id: 4,
    name: "Toss Pencil into the Cup",
    brief: "Hold pencil with upper lip and toss into the cup.",
    rules: [
      "Hold the pencil using ONLY your upper lip.",
      "No hands allowed.",
      "Toss them into the cup one by one.",
      "Score based on number of successful tosses."
    ],
    scoring: "20 Points per pencil that lands inside.",
    active: true,
    theme: "from-violet-400 to-purple-500",
    icon: "✏️",
    type: "INDIVIDUAL"
  },
  {
    id: 5,
    name: "Memory Game",
    brief: "List of 10 items to memorize and recall.",
    rules: [
      "Observe the list of 10 items for 30 seconds.",
      "Recall them in the correct order (if required).",
      "Write down or say the items."
    ],
    scoring: "10 Points per correct item.",
    active: true,
    theme: "from-yellow-400 to-amber-500",
    icon: "🧠",
    type: "INDIVIDUAL"
  },
  {
    id: 6,
    name: "Guess the order of toffees",
    brief: "5 players in each team try to arrange the toffees one by one.",
    rules: [
      "Team Game: 5 players per team.",
      "Taste/Identify the toffees.",
      "Arrange them in the correct sequence.",
      "Work together to solve the order."
    ],
    scoring: "50 Points for fully correct sequence. -5 per mistake.",
    active: true,
    theme: "from-stone-400 to-stone-600",
    icon: "🍬",
    type: "TEAM"
  },
  {
    id: 7,
    name: "Balance the Ball",
    brief: "5 player in each team balance the ball holding the ball using pen.",
    rules: [
      "Team Game: 5 players per team.",
      "Each player holds a pen.",
      "Balance the ball together using the pens.",
      "Don't let it drop."
    ],
    scoring: "10 Points for every 10 seconds balanced. Max 100.",
    active: true,
    theme: "from-rose-400 to-pink-500",
    icon: "⚖️",
    type: "TEAM"
  },
  {
    id: 8,
    name: "Sip the Nips",
    brief: "2 players in each team. Pick gems with a straw.",
    rules: [
      "Team Game: 2 players per team.",
      "Use a straw to suck up gems from a bowl.",
      "Drop them into your cup.",
      "No hands allowed."
    ],
    scoring: "5 Points per gem collected within the time limit.",
    active: true,
    theme: "from-cyan-400 to-sky-500",
    icon: "🥤",
    type: "TEAM"
  },
  {
    id: 9,
    name: "Act the word from the Random Box",
    brief: "2 players in each team. Act and guess.",
    rules: [
      "Team Game: 2 players per team.",
      "One player acts out a word from the box.",
      "The other player tries to guess it.",
      "No speaking allowed."
    ],
    scoring: "20 Points per correct guess.",
    active: true,
    theme: "from-fuchsia-400 to-pink-600",
    icon: "🎭",
    type: "TEAM"
  },
  {
    id: 10,
    name: "Quiz Rapid Fire",
    brief: "5 random players in each team. Rapid fire questions.",
    rules: [
      "Team Game: 5 players per team.",
      "Rapid fire questions asked to the team.",
      "Answer quickly.",
      "Score distributed among them."
    ],
    scoring: "10 Points per correct answer.",
    active: true,
    theme: "from-indigo-400 to-blue-600",
    icon: "⚡",
    type: "TEAM"
  }
];
