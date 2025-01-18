export const PIXELS_TO_FEET_RATIO = 0.05;

export const ROOM_TYPES = {
  bedroom: ['bed', 'bedroom', 'master', 'guest'],
  bathroom: ['bath', 'bathroom', 'shower', 'wc'],
  kitchen: ['kitchen', 'cooking', 'stove'],
  living: ['living', 'family', 'great'],
  dining: ['dining', 'dinner'],
  garage: ['garage', 'parking'],
  office: ['office', 'study', 'den']
};

export const STANDARD_WALL_HEIGHT = 8;

export const MATERIAL_OPTIONS = {
  flooring: [
    { name: 'Standard Carpet', costPerSqFt: 3 },
    { name: 'Hardwood', costPerSqFt: 8 },
    { name: 'Luxury Vinyl', costPerSqFt: 4 },
    { name: 'Ceramic Tile', costPerSqFt: 6 }
  ],
  paint: [
    { name: 'Basic Paint', costPerSqFt: 0.5 },
    { name: 'Premium Paint', costPerSqFt: 0.8 },
    { name: 'Designer Paint', costPerSqFt: 1.2 }
  ]
};