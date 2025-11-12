// Map configurations for Monopoly game
// 4 free maps + 4 premium maps (unlockable with coins)

export const maps = {
  classic: {
    id: 'classic',
    name: 'Classic',
    free: true,
    cost: 0,
    theme: 'traditional',
    spaces: [
      { id: 0, type: 'go', name: 'GO', position: 0 },
      { id: 1, type: 'property', name: 'Mediterranean Avenue', color: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], position: 1 },
      { id: 2, type: 'chest', name: 'Community Chest', position: 2 },
      { id: 3, type: 'property', name: 'Baltic Avenue', color: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], position: 3 },
      { id: 4, type: 'tax', name: 'Income Tax', amount: 200, position: 4 },
      { id: 5, type: 'railroad', name: 'Reading Railroad', price: 200, position: 5 },
      { id: 6, type: 'property', name: 'Oriental Avenue', color: 'lightblue', price: 100, rent: [6, 30, 90, 270, 400, 550], position: 6 },
      { id: 7, type: 'chance', name: 'Chance', position: 7 },
      { id: 8, type: 'property', name: 'Vermont Avenue', color: 'lightblue', price: 100, rent: [6, 30, 90, 270, 400, 550], position: 8 },
      { id: 9, type: 'property', name: 'Connecticut Avenue', color: 'lightblue', price: 120, rent: [8, 40, 100, 300, 450, 600], position: 9 },
      { id: 10, type: 'jail', name: 'Jail / Visiting', position: 10 },
      { id: 11, type: 'property', name: 'St. Charles Place', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], position: 11 },
      { id: 12, type: 'utility', name: 'Electric Company', price: 150, position: 12 },
      { id: 13, type: 'property', name: 'States Avenue', color: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], position: 13 },
      { id: 14, type: 'property', name: 'Virginia Avenue', color: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900], position: 14 },
      { id: 15, type: 'railroad', name: 'Pennsylvania Railroad', price: 200, position: 15 },
      { id: 16, type: 'property', name: 'St. James Place', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], position: 16 },
      { id: 17, type: 'chest', name: 'Community Chest', position: 17 },
      { id: 18, type: 'property', name: 'Tennessee Avenue', color: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], position: 18 },
      { id: 19, type: 'property', name: 'New York Avenue', color: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000], position: 19 },
      { id: 20, type: 'parking', name: 'Vacation', position: 20 },
      { id: 21, type: 'property', name: 'Kentucky Avenue', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], position: 21 },
      { id: 22, type: 'chance', name: 'Chance', position: 22 },
      { id: 23, type: 'property', name: 'Indiana Avenue', color: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], position: 23 },
      { id: 24, type: 'property', name: 'Illinois Avenue', color: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100], position: 24 },
      { id: 25, type: 'railroad', name: 'B&O Railroad', price: 200, position: 25 },
      { id: 26, type: 'property', name: 'Atlantic Avenue', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], position: 26 },
      { id: 27, type: 'property', name: 'Ventnor Avenue', color: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], position: 27 },
      { id: 28, type: 'utility', name: 'Water Works', price: 150, position: 28 },
      { id: 29, type: 'property', name: 'Marvin Gardens', color: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200], position: 29 },
      { id: 30, type: 'gotojail', name: 'Go To Jail', position: 30 },
      { id: 31, type: 'property', name: 'Pacific Avenue', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], position: 31 },
      { id: 32, type: 'property', name: 'North Carolina Avenue', color: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], position: 32 },
      { id: 33, type: 'chest', name: 'Community Chest', position: 33 },
      { id: 34, type: 'property', name: 'Pennsylvania Avenue', color: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], position: 34 },
      { id: 35, type: 'railroad', name: 'Short Line', price: 200, position: 35 },
      { id: 36, type: 'chance', name: 'Chance', position: 36 },
      { id: 37, type: 'property', name: 'Park Place', color: 'darkblue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], position: 37 },
      { id: 38, type: 'tax', name: 'Luxury Tax', amount: 100, position: 38 },
      { id: 39, type: 'property', name: 'Boardwalk', color: 'darkblue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], position: 39 }
    ]
  },
  techvalley: {
    id: 'techvalley',
    name: 'Tech Valley',
    free: true,
    cost: 0,
    theme: 'technology',
    spaces: [
      { id: 0, type: 'go', name: 'START', position: 0 },
      { id: 1, type: 'property', name: 'Startup Garage', color: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], position: 1 },
      { id: 2, type: 'chest', name: 'Bug Report', position: 2 },
      { id: 3, type: 'property', name: 'Code Cafe', color: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], position: 3 },
      { id: 4, type: 'tax', name: 'Server Costs', amount: 200, position: 4 },
      { id: 5, type: 'railroad', name: 'Fiber Line Alpha', price: 200, position: 5 },
      { id: 6, type: 'property', name: 'App Store', color: 'lightblue', price: 100, rent: [6, 30, 90, 270, 400, 550], position: 6 },
      { id: 7, type: 'chance', name: 'Pull Request', position: 7 },
      { id: 8, type: 'property', name: 'Cloud Nine', color: 'lightblue', price: 100, rent: [6, 30, 90, 270, 400, 550], position: 8 },
      { id: 9, type: 'property', name: 'Data Center', color: 'lightblue', price: 120, rent: [8, 40, 100, 300, 450, 600], position: 9 },
      { id: 10, type: 'jail', name: 'Debug Prison', position: 10 },
      // ... (shortened for brevity, similar pattern for all 40 spaces)
    ]
  },
  campus: {
    id: 'campus',
    name: 'Campus',
    free: true,
    cost: 0,
    theme: 'university'
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy Kingdom',
    free: true,
    cost: 0,
    theme: 'medieval'
  },
  space: {
    id: 'space',
    name: 'Space Station',
    free: false,
    cost: 200,
    theme: 'scifi'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean World',
    free: false,
    cost: 350,
    theme: 'underwater'
  },
  movies: {
    id: 'movies',
    name: 'Hollywood',
    free: false,
    cost: 500,
    theme: 'cinema'
  },
  historic: {
    id: 'historic',
    name: 'Historic City',
    free: false,
    cost: 750,
    theme: 'historical'
  }
};

export const colorGroups = {
  brown: ['brown1', 'brown2'],
  lightblue: ['lightblue1', 'lightblue2', 'lightblue3'],
  pink: ['pink1', 'pink2', 'pink3'],
  orange: ['orange1', 'orange2', 'orange3'],
  red: ['red1', 'red2', 'red3'],
  yellow: ['yellow1', 'yellow2', 'yellow3'],
  green: ['green1', 'green2', 'green3'],
  darkblue: ['darkblue1', 'darkblue2']
};
