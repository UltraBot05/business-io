// Game Logic - Dice, Movement, Property Management

// Pure random dice system
export function rollDice(playerId) {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
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

export function canBuyProperty(player, space) {
  if (!space) return false;
  // Can buy properties, railroads, and utilities
  const buyableTypes = ['property', 'railroad', 'utility'];
  if (!buyableTypes.includes(space.type)) return false;
  if (!space.price) return false;
  if (player.money < space.price) return false;
  return true;
}

export function buyProperty(player, space) {
  if (!canBuyProperty(player, space)) {
    throw new Error('Cannot buy this property');
  }
  
  player.money -= space.price;
  
  // Store in appropriate array based on type
  if (space.type === 'property') {
    if (!player.properties) player.properties = [];
    player.properties.push(space.id);
  } else if (space.type === 'railroad') {
    if (!player.railroads) player.railroads = [];
    player.railroads.push(space.id);
  } else if (space.type === 'utility') {
    if (!player.utilities) player.utilities = [];
    player.utilities.push(space.id);
  }
  
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

export function handleSpecialSpace(player, space, autoDeduct = true) {
  const actions = [];
  
  switch (space.type) {
    case 'go':
      actions.push({ type: 'collect', amount: 200 });
      break;
      
    case 'tax':
      // Deduct tax immediately when landing
      if (autoDeduct) {
        player.money -= space.amount;
      }
      actions.push({ type: 'pay_tax', amount: space.amount, requiresConfirmation: true });
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

// Pay tax (called explicitly)
export function payTax(player, amount) {
  if (player.money < amount) {
    // TODO: Handle bankruptcy
    amount = player.money;
  }
  player.money -= amount;
  return player;
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
