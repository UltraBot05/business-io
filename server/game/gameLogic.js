// Game Logic - Dice, Movement, Property Management

// Smart dice system - ensures fairness
const diceHistory = new Map(); // playerId -> array of rolls

export function rollDice(playerId) {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  
  // Track history for fairness
  if (!diceHistory.has(playerId)) {
    diceHistory.set(playerId, []);
  }
  
  const history = diceHistory.get(playerId);
  history.push(dice1 + dice2);
  
  // Keep last 20 rolls
  if (history.length > 20) {
    history.shift();
  }
  
  // Calculate average
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  
  // If player is unlucky (avg < 6.5 after 10+ rolls), boost them
  if (history.length >= 10 && avg < 6.5) {
    // 30% chance to reroll for better result
    if (Math.random() < 0.3) {
      const newDice1 = Math.floor(Math.random() * 6) + 1;
      const newDice2 = Math.floor(Math.random() * 6) + 1;
      const newTotal = newDice1 + newDice2;
      
      if (newTotal > dice1 + dice2) {
        return [newDice1, newDice2];
      }
    }
  }
  
  return [dice1, dice2];
}

export function movePlayer(player, spaces) {
  const oldPosition = player.position;
  player.position = (player.position + spaces) % 40;
  
  // Passed GO
  if (player.position < oldPosition) {
    player.money += 200;
    return { passedGo: true };
  }
  
  return { passedGo: false };
}

export function getSpaceAt(position, map) {
  return map.spaces[position];
}

export function canBuyProperty(player, property) {
  if (!property || property.type !== 'property') return false;
  if (property.owner) return false;
  if (player.money < property.price) return false;
  return true;
}

export function buyProperty(player, property) {
  if (!canBuyProperty(player, property)) {
    throw new Error('Cannot buy this property');
  }
  
  player.money -= property.price;
  player.properties.push(property.id);
  property.owner = player.id;
  
  return player;
}

export function calculateRent(property, owner) {
  if (!property.owner) return 0;
  
  let rent = property.rent[0]; // Base rent
  
  // TODO: Add house/hotel multipliers
  // TODO: Add monopoly bonuses
  // TODO: Add railroad/utility special rules
  
  return rent;
}

export function payRent(player, owner, amount) {
  if (player.money < amount) {
    // TODO: Handle bankruptcy
    amount = player.money;
  }
  
  player.money -= amount;
  owner.money += amount;
  
  return { player, owner, amount };
}

export function handleSpecialSpace(player, space) {
  const actions = [];
  
  switch (space.type) {
    case 'go':
      actions.push({ type: 'collect', amount: 200 });
      break;
      
    case 'tax':
      player.money -= space.amount;
      actions.push({ type: 'pay_tax', amount: space.amount });
      break;
      
    case 'gotojail':
      player.position = 10; // Jail position
      player.inJail = true;
      player.jailTurns = 0;
      actions.push({ type: 'go_to_jail' });
      break;
      
    case 'chance':
    case 'chest':
      // TODO: Implement chance/chest cards
      actions.push({ type: 'draw_card', cardType: space.type });
      break;
      
    case 'parking':
      // Free parking - do nothing
      break;
  }
  
  return actions;
}

// Check if player owns all properties of a color group (monopoly)
export function hasMonopoly(player, colorGroup, allProperties) {
  const groupProperties = allProperties.filter(p => p.color === colorGroup);
  const ownedCount = groupProperties.filter(p => 
    player.properties.includes(p.id)
  ).length;
  
  return ownedCount === groupProperties.length;
}

// Get all properties owned by a player
export function getPlayerProperties(player, allProperties) {
  return allProperties.filter(p => player.properties.includes(p.id));
}

// Check game over condition
export function checkGameOver(players) {
  const activePlayers = players.filter(p => p.money > 0 || p.properties.length > 0);
  
  if (activePlayers.length === 1) {
    return { gameOver: true, winner: activePlayers[0] };
  }
  
  return { gameOver: false };
}
