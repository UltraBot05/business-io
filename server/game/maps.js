// Map data for all 8 maps
// 4 free + 4 premium

export const maps = {
  classic: {
    id: 'classic',
    name: 'Classic',
    spaces: [
      { id: 0, type: 'go', name: 'GO', position: 0 },
      { id: 1, type: 'property', name: 'Mediterranean Avenue', color: '#8B4513', price: 60, rent: [2, 10, 30, 90, 160, 250], position: 1 },
      { id: 2, type: 'chest', name: 'Community Chest', position: 2 },
      { id: 3, type: 'property', name: 'Baltic Avenue', color: '#8B4513', price: 60, rent: [4, 20, 60, 180, 320, 450], position: 3 },
      { id: 4, type: 'tax', name: 'Income Tax', amount: 200, position: 4 },
      { id: 5, type: 'railroad', name: 'Reading Railroad', price: 200, position: 5 },
      { id: 6, type: 'property', name: 'Oriental Avenue', color: '#87CEEB', price: 100, rent: [6, 30, 90, 270, 400, 550], position: 6 },
      { id: 7, type: 'chance', name: 'Chance', position: 7 },
      { id: 8, type: 'property', name: 'Vermont Avenue', color: '#87CEEB', price: 100, rent: [6, 30, 90, 270, 400, 550], position: 8 },
      { id: 9, type: 'property', name: 'Connecticut Avenue', color: '#87CEEB', price: 120, rent: [8, 40, 100, 300, 450, 600], position: 9 },
      { id: 10, type: 'jail', name: 'Jail', position: 10 },
      { id: 11, type: 'property', name: 'St. Charles Place', color: '#FF1493', price: 140, rent: [10, 50, 150, 450, 625, 750], position: 11 },
      { id: 12, type: 'utility', name: 'Electric Company', price: 150, position: 12 },
      { id: 13, type: 'property', name: 'States Avenue', color: '#FF1493', price: 140, rent: [10, 50, 150, 450, 625, 750], position: 13 },
      { id: 14, type: 'property', name: 'Virginia Avenue', color: '#FF1493', price: 160, rent: [12, 60, 180, 500, 700, 900], position: 14 },
      { id: 15, type: 'railroad', name: 'Pennsylvania Railroad', price: 200, position: 15 },
      { id: 16, type: 'property', name: 'St. James Place', color: '#FFA500', price: 180, rent: [14, 70, 200, 550, 750, 950], position: 16 },
      { id: 17, type: 'chest', name: 'Community Chest', position: 17 },
      { id: 18, type: 'property', name: 'Tennessee Avenue', color: '#FFA500', price: 180, rent: [14, 70, 200, 550, 750, 950], position: 18 },
      { id: 19, type: 'property', name: 'New York Avenue', color: '#FFA500', price: 200, rent: [16, 80, 220, 600, 800, 1000], position: 19 },
      { id: 20, type: 'parking', name: 'Free Parking', position: 20 },
      { id: 21, type: 'property', name: 'Kentucky Avenue', color: '#FF0000', price: 220, rent: [18, 90, 250, 700, 875, 1050], position: 21 },
      { id: 22, type: 'chance', name: 'Chance', position: 22 },
      { id: 23, type: 'property', name: 'Indiana Avenue', color: '#FF0000', price: 220, rent: [18, 90, 250, 700, 875, 1050], position: 23 },
      { id: 24, type: 'property', name: 'Illinois Avenue', color: '#FF0000', price: 240, rent: [20, 100, 300, 750, 925, 1100], position: 24 },
      { id: 25, type: 'railroad', name: 'B&O Railroad', price: 200, position: 25 },
      { id: 26, type: 'property', name: 'Atlantic Avenue', color: '#FFFF00', price: 260, rent: [22, 110, 330, 800, 975, 1150], position: 26 },
      { id: 27, type: 'property', name: 'Ventnor Avenue', color: '#FFFF00', price: 260, rent: [22, 110, 330, 800, 975, 1150], position: 27 },
      { id: 28, type: 'utility', name: 'Water Works', price: 150, position: 28 },
      { id: 29, type: 'property', name: 'Marvin Gardens', color: '#FFFF00', price: 280, rent: [24, 120, 360, 850, 1025, 1200], position: 29 },
      { id: 30, type: 'gotojail', name: 'Go To Jail', position: 30 },
      { id: 31, type: 'property', name: 'Pacific Avenue', color: '#00FF00', price: 300, rent: [26, 130, 390, 900, 1100, 1275], position: 31 },
      { id: 32, type: 'property', name: 'North Carolina Avenue', color: '#00FF00', price: 300, rent: [26, 130, 390, 900, 1100, 1275], position: 32 },
      { id: 33, type: 'chest', name: 'Community Chest', position: 33 },
      { id: 34, type: 'property', name: 'Pennsylvania Avenue', color: '#00FF00', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], position: 34 },
      { id: 35, type: 'railroad', name: 'Short Line', price: 200, position: 35 },
      { id: 36, type: 'chance', name: 'Chance', position: 36 },
      { id: 37, type: 'property', name: 'Park Place', color: '#0000FF', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], position: 37 },
      { id: 38, type: 'tax', name: 'Luxury Tax', amount: 100, position: 38 },
      { id: 39, type: 'property', name: 'Boardwalk', color: '#0000FF', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], position: 39 }
    ]
  }
};

export function getMap(mapId) {
  return maps[mapId] || maps.classic;
}
