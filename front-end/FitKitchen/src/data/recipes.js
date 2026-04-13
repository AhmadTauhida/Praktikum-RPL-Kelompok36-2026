export const recipes = [
  { 
    id: 1, 
    title: 'Avocado Toast with Eggs', 
    description: 'A nutritious breakfast with healthy fats and protein', 
    calories: 350, protein: 15, prepTime: '15 mins', diet: 'vegetarian', 
    image: new URL('../assets/AvocadoToast.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '2 eggs',
      'Salt and pepper to taste',
      'Cherry tomatoes (optional)',
      'Red pepper flakes (optional)'
    ],
    steps: [
      'Toast the bread until golden brown',
      'Mash the avocado and spread on toast',
      'Cook eggs to your preference (fried, poached, or scrambled)',
      'Place eggs on top of avocado toast',
      'Season with salt, pepper, and red pepper flakes',
      'Serve immediately with cherry tomatoes on the side'
    ] 
  },
  { 
    id: 2, 
    title: 'Grilled Chicken Salad', 
    description: 'Light and protein-packed salad with grilled chicken', 
    calories: 420, protein: 35, prepTime: '25 mins', diet: 'paleo', 
    image: new URL('../assets/GrilledChickenSalad.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '150g Chicken breast',
      '2 cups mixed greens (spinach, lettuce)',
      '1/2 cucumber, sliced',
      '1/4 red onion, thinly sliced',
      'Olive oil and lemon juice dressing',
      'Dried oregano'
    ],
    steps: [
      'Season chicken breast with salt, pepper, and oregano',
      'Grill chicken for 6-7 minutes per side until cooked through',
      'Let the chicken rest for 5 minutes, then slice',
      'In a large bowl, toss greens, cucumber, and onion',
      'Top with grilled chicken slices',
      'Drizzle with olive oil and lemon juice before serving'
    ]
  },
  { 
    id: 3, 
    title: 'Quinoa Buddha Bowl', 
    description: 'Colorful and nutritious bowl packed with vegetables and quinoa', 
    calories: 480, protein: 18, prepTime: '20 mins', diet: 'vegan', 
    image: new URL('../assets/QuinoaBuddha.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '1/2 cup cooked quinoa',
      '1/4 cup chickpeas, rinsed',
      '1/2 sweet potato, cubed and roasted',
      '1/2 avocado, sliced',
      'Handful of shredded carrots',
      'Tahini dressing'
    ],
    steps: [
      'Place cooked quinoa as the base of the bowl',
      'Arrange chickpeas, roasted sweet potato, and avocado on top',
      'Add shredded carrots for crunch',
      'Drizzle generously with tahini dressing',
      'Garnish with sesame seeds if desired'
    ]
  },
  { 
    id: 4, 
    title: 'Salmon with Asparagus', 
    description: 'Omega-3 rich salmon with tender asparagus', 
    calories: 520, protein: 42, prepTime: '20 mins', diet: 'keto', 
    image: new URL('../assets/SalmonWithAsparagus.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '1 Salmon fillet (approx. 180g)',
      '1 bunch of asparagus, trimmed',
      '2 tbsp butter or olive oil',
      '2 cloves garlic, minced',
      'Lemon wedges',
      'Fresh dill'
    ],
    steps: [
      'Preheat oven to 200°C',
      'Place salmon and asparagus on a baking sheet',
      'Drizzle with oil and top with minced garlic',
      'Bake for 12-15 minutes until salmon flakes easily',
      'Squeeze fresh lemon juice over the top',
      'Garnish with fresh dill'
    ]
  },
  { 
    id: 5, 
    title: 'Greek Yogurt Parfait', 
    description: 'Protein-rich breakfast with fruits and granola', 
    calories: 280, protein: 20, prepTime: '10 mins', diet: 'vegetarian', 
    image: new URL('../assets/GreekYogurtParfait.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '1 cup Greek yogurt (plain, unsweetened)',
      '1/4 cup low-sugar granola',
      '1/2 cup mixed berries (blueberries, strawberries)',
      '1 tsp honey or maple syrup',
      'A pinch of cinnamon'
    ],
    steps: [
      'Spoon half of the yogurt into a glass or bowl',
      'Add a layer of mixed berries',
      'Add the remaining yogurt on top',
      'Sprinkle with granola and cinnamon',
      'Drizzle with honey just before serving'
    ]
  },
  { 
    id: 6, 
    title: 'Turkey & Veggie Wrap', 
    description: 'Quick and healthy wrap perfect for lunch', 
    calories: 380, protein: 28, prepTime: '15 mins', diet: 'balanced', 
    image: new URL('../assets/TurkeyVeggieWrap.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '1 Whole wheat tortilla',
      '3-4 slices of lean turkey breast',
      '1/4 bell pepper, sliced',
      'Handful of baby spinach',
      '1 tbsp hummus',
      '1 slice of provolone cheese (optional)'
    ],
    steps: [
      'Lay the tortilla flat and spread hummus in the center',
      'Layer the turkey slices and cheese',
      'Add spinach and bell pepper strips',
      'Fold the sides and roll tightly',
      'Slice diagonally and serve cool'
    ]
  },
  { 
    id: 7, 
    title: 'Stir-Fried Tofu & Vegetables', 
    description: 'Colorful Asian-inspired stir-fry with tofu', 
    calories: 390, protein: 22, prepTime: '25 mins', diet: 'vegan',
    image: new URL('../assets/StirFriedTofu.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '200g firm tofu, pressed and cubed',
      '1 cup broccoli florets',
      '1 red bell pepper, chopped',
      '2 tbsp soy sauce (low sodium)',
      '1 tsp ginger, minced',
      '1 tbsp sesame oil'
    ],
    steps: [
      'Heat sesame oil in a wok or large pan',
      'Fry tofu cubes until golden brown on all sides; set aside',
      'Stir-fry broccoli and bell pepper for 4-5 minutes',
      'Add ginger and tofu back into the pan',
      'Pour in soy sauce and toss to coat everything evenly',
      'Serve hot, optionally over brown rice'
    ]
  },
  { 
    id: 8, 
    title: 'Chicken Breast with Sweet Potato', 
    description: 'Lean protein with complex carbohydrates', 
    calories: 460, protein: 38, prepTime: '35 mins', diet: 'balanced', 
    image: new URL('../assets/ChickenBreast.jpeg', import.meta.url).href, 
    calIcon: new URL('../assets/icons/Calori.svg', import.meta.url).href,
    proIcon: new URL('../assets/icons/protein.svg', import.meta.url).href,
    timeIcon: new URL('../assets/icons/time.svg', import.meta.url).href,
    ingredients: [
      '150g Chicken breast',
      '1 medium sweet potato, cubed',
      '1 cup broccoli florets',
      '1 tbsp olive oil',
      'Garlic powder and paprika',
      'Salt and pepper'
    ],
    steps: [
      'Toss sweet potato cubes with oil and bake at 200°C for 20 mins',
      'Season chicken with garlic powder, paprika, salt, and pepper',
      'Pan-sear chicken for 6 minutes per side',
      'Steam broccoli for 3-4 minutes',
      'Plate the chicken alongside the roasted sweet potatoes and broccoli',
      'Add a dash of black pepper over the veggies'
    ] 
  }
];