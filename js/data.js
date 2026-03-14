// ============================================================
// DEFAULT MENU DATA - Culinary Provisions
// Prices calibrated: 3-course dinner for 2 ≈ €70-90 + wine
// Each item includes costPrice & ingredients with qty for
// accurate per-portion costing
// ============================================================

const DEFAULT_CATEGORIES = [
  { id: 'starters',       name: 'Starters',          icon: 'fa-seedling',     order: 1 },
  { id: 'mains',          name: 'Main Courses',      icon: 'fa-utensils',     order: 2 },
  { id: 'desserts',       name: 'Desserts',           icon: 'fa-ice-cream',    order: 3 },
  { id: 'soft-drinks',    name: 'Soft Drinks',        icon: 'fa-glass-water',  order: 4 },
  { id: 'wines-glass',    name: 'Wines by Glass',     icon: 'fa-wine-glass',   order: 5 },
  { id: 'wines-bottle',   name: 'Wines by Bottle',    icon: 'fa-wine-bottle',  order: 6 },
  { id: 'beers',          name: 'Beers',              icon: 'fa-beer-mug-empty', order: 7 },
  { id: 'hot-drinks',     name: 'Hot Drinks',         icon: 'fa-mug-hot',      order: 8 },
];

const DEFAULT_MENU = [
  // ── Starters (12) ─────────────────────────────────
  { id: 's01', name: 'Bruschetta al Pomodoro',     categoryId: 'starters', price: 8.00,  costPrice: 2.10, ingredients: [{name:'Ciabatta bread',qty:'2 slices',cost:0.40},{name:'Cherry tomatoes',qty:'150g',cost:0.60},{name:'Fresh basil',qty:'5g',cost:0.20},{name:'Olive oil EV',qty:'15ml',cost:0.50},{name:'Garlic',qty:'2 cloves',cost:0.10},{name:'Balsamic glaze',qty:'10ml',cost:0.30}], active: true },
  { id: 's02', name: 'Caesar Salad',               categoryId: 'starters', price: 9.50,  costPrice: 2.50, ingredients: [{name:'Romaine lettuce',qty:'1 head',cost:0.50},{name:'Parmesan',qty:'30g',cost:0.80},{name:'Croutons',qty:'40g',cost:0.20},{name:'Anchovy fillets',qty:'3 pcs',cost:0.40},{name:'Caesar dressing',qty:'30ml',cost:0.35},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Egg',qty:'1 pc',cost:0.15}], active: true },
  { id: 's03', name: 'French Onion Soup',          categoryId: 'starters', price: 9.00,  costPrice: 2.00, ingredients: [{name:'Yellow onions',qty:'300g',cost:0.50},{name:'Beef stock',qty:'250ml',cost:0.40},{name:'Gruyère cheese',qty:'40g',cost:0.60},{name:'Baguette',qty:'2 slices',cost:0.15},{name:'Butter',qty:'15g',cost:0.15},{name:'Thyme',qty:'3g',cost:0.10},{name:'White wine',qty:'30ml',cost:0.10}], active: true },
  { id: 's04', name: 'Calamari Fritti',            categoryId: 'starters', price: 11.00, costPrice: 2.90, ingredients: [{name:'Squid tubes',qty:'180g',cost:1.60},{name:'Semolina flour',qty:'40g',cost:0.20},{name:'Frying oil',qty:'100ml',cost:0.40},{name:'Aioli sauce',qty:'30ml',cost:0.40},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Parsley',qty:'5g',cost:0.10},{name:'Chilli flakes',qty:'2g',cost:0.05},{name:'Salt & pepper',qty:'3g',cost:0.05}], active: true },
  { id: 's05', name: 'Beef Carpaccio',             categoryId: 'starters', price: 13.00, costPrice: 4.50, ingredients: [{name:'Beef fillet',qty:'120g',cost:3.20},{name:'Rocket',qty:'30g',cost:0.30},{name:'Parmesan shavings',qty:'20g',cost:0.40},{name:'Capers',qty:'10g',cost:0.15},{name:'Olive oil EV',qty:'15ml',cost:0.25},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Truffle oil',qty:'5ml',cost:0.10}], active: true },
  { id: 's06', name: 'Prawn Cocktail',             categoryId: 'starters', price: 12.00, costPrice: 4.00, ingredients: [{name:'King prawns',qty:'120g',cost:2.80},{name:'Marie Rose sauce',qty:'30ml',cost:0.40},{name:'Iceberg lettuce',qty:'50g',cost:0.20},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Paprika',qty:'2g',cost:0.05},{name:'Avocado',qty:'½ pc',cost:0.30},{name:'Bread roll',qty:'1 pc',cost:0.15}], active: true },
  { id: 's07', name: 'Caprese Salad',              categoryId: 'starters', price: 9.00,  costPrice: 2.60, ingredients: [{name:'Buffalo mozzarella',qty:'125g',cost:1.40},{name:'Vine tomatoes',qty:'150g',cost:0.50},{name:'Fresh basil',qty:'5g',cost:0.20},{name:'Olive oil EV',qty:'15ml',cost:0.30},{name:'Balsamic reduction',qty:'10ml',cost:0.20}], active: true },
  { id: 's08', name: 'Wild Mushroom Soup',         categoryId: 'starters', price: 9.50,  costPrice: 2.20, ingredients: [{name:'Mixed wild mushrooms',qty:'150g',cost:1.00},{name:'Cream',qty:'50ml',cost:0.30},{name:'Shallots',qty:'40g',cost:0.15},{name:'Vegetable stock',qty:'300ml',cost:0.20},{name:'Thyme',qty:'3g',cost:0.10},{name:'Truffle oil',qty:'5ml',cost:0.25},{name:'Bread roll',qty:'1 pc',cost:0.15},{name:'Butter',qty:'10g',cost:0.05}], active: true },
  { id: 's09', name: 'Smoked Salmon Platter',      categoryId: 'starters', price: 13.50, costPrice: 4.80, ingredients: [{name:'Smoked salmon',qty:'100g',cost:3.50},{name:'Cream cheese',qty:'40g',cost:0.40},{name:'Capers',qty:'10g',cost:0.15},{name:'Red onion',qty:'20g',cost:0.10},{name:'Dill',qty:'3g',cost:0.15},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Toast points',qty:'4 pcs',cost:0.20},{name:'Horseradish cream',qty:'15ml',cost:0.20}], active: true },
  { id: 's10', name: 'Soup of the Day',            categoryId: 'starters', price: 7.50,  costPrice: 1.50, ingredients: [{name:'Seasonal vegetables',qty:'200g',cost:0.60},{name:'Stock',qty:'300ml',cost:0.30},{name:'Cream',qty:'30ml',cost:0.15},{name:'Herbs',qty:'5g',cost:0.10},{name:'Bread roll',qty:'1 pc',cost:0.15},{name:'Butter',qty:'10g',cost:0.10},{name:'Seasoning',qty:'3g',cost:0.10}], active: true },
  { id: 's11', name: 'Charcuterie Board',          categoryId: 'starters', price: 14.00, costPrice: 4.60, ingredients: [{name:'Prosciutto',qty:'50g',cost:1.20},{name:'Salami Napoli',qty:'40g',cost:0.80},{name:'Coppa',qty:'40g',cost:0.80},{name:'Cornichons',qty:'30g',cost:0.20},{name:'Olives',qty:'40g',cost:0.30},{name:'Grilled artichokes',qty:'40g',cost:0.40},{name:'Focaccia',qty:'2 slices',cost:0.30},{name:'Fig jam',qty:'20g',cost:0.20},{name:'Mustard',qty:'15g',cost:0.15},{name:'Mixed nuts',qty:'30g',cost:0.25}], active: true },
  { id: 's12', name: 'Tuna Tartare',               categoryId: 'starters', price: 13.00, costPrice: 4.60, ingredients: [{name:'Sushi-grade tuna',qty:'120g',cost:3.40},{name:'Avocado',qty:'½ pc',cost:0.35},{name:'Soy sauce',qty:'10ml',cost:0.10},{name:'Sesame oil',qty:'5ml',cost:0.15},{name:'Ginger',qty:'5g',cost:0.10},{name:'Sesame seeds',qty:'5g',cost:0.10},{name:'Spring onion',qty:'10g',cost:0.10},{name:'Wonton crisps',qty:'4 pcs',cost:0.15},{name:'Lime',qty:'½ pc',cost:0.10},{name:'Chilli',qty:'3g',cost:0.05}], active: true },

  // ── Main Courses (15) ─────────────────────────────
  { id: 'm01', name: 'Grilled Atlantic Salmon',    categoryId: 'mains', price: 22.00, costPrice: 6.40, ingredients: [{name:'Salmon fillet',qty:'200g',cost:4.00},{name:'Asparagus',qty:'100g',cost:0.80},{name:'New potatoes',qty:'150g',cost:0.40},{name:'Hollandaise sauce',qty:'40ml',cost:0.60},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Dill',qty:'3g',cost:0.10},{name:'Olive oil',qty:'10ml',cost:0.20},{name:'Butter',qty:'15g',cost:0.15},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm02', name: 'Beef Tenderloin',            categoryId: 'mains', price: 28.00, costPrice: 10.10, ingredients: [{name:'Beef tenderloin',qty:'250g',cost:7.50},{name:'Dauphinoise potatoes',qty:'150g',cost:0.80},{name:'Seasonal greens',qty:'80g',cost:0.50},{name:'Red wine jus',qty:'60ml',cost:0.80},{name:'Butter',qty:'20g',cost:0.25},{name:'Thyme',qty:'3g',cost:0.10},{name:'Garlic',qty:'2 cloves',cost:0.10},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm03', name: 'Chicken Supreme',            categoryId: 'mains', price: 19.00, costPrice: 4.85, ingredients: [{name:'Chicken supreme',qty:'220g',cost:2.50},{name:'Mashed potato',qty:'180g',cost:0.50},{name:'Wild mushroom cream sauce',qty:'60ml',cost:0.80},{name:'Green beans',qty:'80g',cost:0.40},{name:'Butter',qty:'20g',cost:0.20},{name:'Tarragon',qty:'3g',cost:0.10},{name:'Chicken jus',qty:'40ml',cost:0.30},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm04', name: 'Rack of Lamb',               categoryId: 'mains', price: 26.00, costPrice: 8.75, ingredients: [{name:'Lamb rack',qty:'3 cutlets',cost:6.50},{name:'Herb crust',qty:'20g',cost:0.30},{name:'Ratatouille',qty:'120g',cost:0.80},{name:'Fondant potato',qty:'150g',cost:0.50},{name:'Lamb jus',qty:'50ml',cost:0.40},{name:'Rosemary',qty:'3g',cost:0.10},{name:'Garlic',qty:'2 cloves',cost:0.10},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm05', name: 'Pan-Seared Sea Bass',        categoryId: 'mains', price: 24.00, costPrice: 7.15, ingredients: [{name:'Sea bass fillet',qty:'180g',cost:4.80},{name:'Saffron risotto',qty:'160g',cost:0.90},{name:'Cherry tomatoes',qty:'60g',cost:0.30},{name:'Samphire',qty:'40g',cost:0.50},{name:'Lemon butter sauce',qty:'40ml',cost:0.40},{name:'Olive oil',qty:'10ml',cost:0.20},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm06', name: 'Slow-Cooked Pork Belly',     categoryId: 'mains', price: 20.00, costPrice: 4.75, ingredients: [{name:'Pork belly',qty:'250g',cost:2.80},{name:'Apple purée',qty:'50ml',cost:0.40},{name:'Crackling',qty:'1 pc',cost:0.20},{name:'Celeriac mash',qty:'150g',cost:0.50},{name:'Cider jus',qty:'50ml',cost:0.40},{name:'Savoy cabbage',qty:'60g',cost:0.30},{name:'Sage',qty:'3g',cost:0.10},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm07', name: 'Duck Breast à l\'Orange',    categoryId: 'mains', price: 24.00, costPrice: 6.90, ingredients: [{name:'Duck breast',qty:'220g',cost:4.80},{name:'Orange sauce',qty:'60ml',cost:0.60},{name:'Sweet potato purée',qty:'150g',cost:0.50},{name:'Bok choy',qty:'80g',cost:0.40},{name:'Orange segments',qty:'60g',cost:0.30},{name:'Star anise',qty:'1 pc',cost:0.10},{name:'Butter',qty:'15g',cost:0.15},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm08', name: 'Lobster Linguine',           categoryId: 'mains', price: 28.00, costPrice: 9.60, ingredients: [{name:'Lobster tail',qty:'150g',cost:7.00},{name:'Linguine pasta',qty:'120g',cost:0.40},{name:'Cherry tomatoes',qty:'80g',cost:0.40},{name:'White wine',qty:'40ml',cost:0.30},{name:'Garlic',qty:'2 cloves',cost:0.10},{name:'Chilli',qty:'3g',cost:0.10},{name:'Parsley',qty:'5g',cost:0.10},{name:'Olive oil',qty:'15ml',cost:0.30},{name:'Bisque sauce',qty:'60ml',cost:0.80},{name:'Lemon',qty:'½ pc',cost:0.10}], active: true },
  { id: 'm09', name: 'Truffle Mushroom Risotto',   categoryId: 'mains', price: 18.00, costPrice: 3.90, ingredients: [{name:'Arborio rice',qty:'100g',cost:0.40},{name:'Mixed mushrooms',qty:'120g',cost:1.20},{name:'Truffle oil',qty:'8ml',cost:0.80},{name:'Parmesan',qty:'40g',cost:0.60},{name:'Shallots',qty:'30g',cost:0.15},{name:'Vegetable stock',qty:'350ml',cost:0.30},{name:'White wine',qty:'40ml',cost:0.20},{name:'Butter',qty:'20g',cost:0.20},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm10', name: 'Gourmet Beef Burger',        categoryId: 'mains', price: 16.00, costPrice: 4.40, ingredients: [{name:'Beef patty',qty:'200g',cost:2.00},{name:'Brioche bun',qty:'1 pc',cost:0.40},{name:'Cheddar cheese',qty:'30g',cost:0.30},{name:'Bacon',qty:'2 rashers',cost:0.40},{name:'Lettuce & tomato',qty:'40g',cost:0.20},{name:'Hand-cut fries',qty:'150g',cost:0.50},{name:'Pickles',qty:'20g',cost:0.10},{name:'House sauce',qty:'20ml',cost:0.20},{name:'Onion rings',qty:'3 pcs',cost:0.30}], active: true },
  { id: 'm11', name: 'Grilled Tiger Prawns',       categoryId: 'mains', price: 24.00, costPrice: 7.45, ingredients: [{name:'Tiger prawns',qty:'6 pcs',cost:5.50},{name:'Garlic butter',qty:'25g',cost:0.40},{name:'Pilaf rice',qty:'150g',cost:0.40},{name:'Grilled vegetables',qty:'100g',cost:0.60},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Chilli',qty:'3g',cost:0.10},{name:'Parsley',qty:'5g',cost:0.10},{name:'Olive oil',qty:'10ml',cost:0.20},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm12', name: 'Veal Milanese',              categoryId: 'mains', price: 22.00, costPrice: 6.60, ingredients: [{name:'Veal escalope',qty:'200g',cost:4.50},{name:'Breadcrumbs',qty:'40g',cost:0.20},{name:'Eggs',qty:'1 pc',cost:0.15},{name:'Spaghetti',qty:'100g',cost:0.30},{name:'Tomato sauce',qty:'60ml',cost:0.40},{name:'Parmesan',qty:'30g',cost:0.40},{name:'Rocket salad',qty:'25g',cost:0.25},{name:'Lemon',qty:'½ pc',cost:0.10},{name:'Frying oil',qty:'80ml',cost:0.30}], active: true },
  { id: 'm13', name: 'Vegetable Tagine',           categoryId: 'mains', price: 17.00, costPrice: 2.50, ingredients: [{name:'Chickpeas',qty:'80g',cost:0.30},{name:'Sweet potato',qty:'100g',cost:0.30},{name:'Courgette',qty:'80g',cost:0.25},{name:'Aubergine',qty:'80g',cost:0.30},{name:'Tomatoes',qty:'100g',cost:0.30},{name:'Ras el hanout',qty:'5g',cost:0.20},{name:'Couscous',qty:'80g',cost:0.25},{name:'Preserved lemon',qty:'10g',cost:0.15},{name:'Coriander',qty:'5g',cost:0.10},{name:'Almonds',qty:'15g',cost:0.20},{name:'Harissa',qty:'10g',cost:0.15}], active: true },
  { id: 'm14', name: 'Ribeye Steak 300g',          categoryId: 'mains', price: 26.00, costPrice: 9.05, ingredients: [{name:'Ribeye steak',qty:'300g',cost:7.00},{name:'Triple-cooked chips',qty:'180g',cost:0.60},{name:'Peppercorn sauce',qty:'50ml',cost:0.50},{name:'Grilled tomato',qty:'1 pc',cost:0.20},{name:'Field mushroom',qty:'1 pc',cost:0.30},{name:'Watercress',qty:'15g',cost:0.20},{name:'Butter',qty:'20g',cost:0.20},{name:'Seasoning',qty:'3g',cost:0.05}], active: true },
  { id: 'm15', name: 'Pan-Seared Tuna Steak',      categoryId: 'mains', price: 23.00, costPrice: 7.30, ingredients: [{name:'Yellowfin tuna steak',qty:'180g',cost:5.00},{name:'Sesame crust',qty:'10g',cost:0.30},{name:'Soy glaze',qty:'15ml',cost:0.20},{name:'Wasabi mash',qty:'150g',cost:0.60},{name:'Asian salad',qty:'60g',cost:0.50},{name:'Pickled ginger',qty:'10g',cost:0.20},{name:'Sesame oil',qty:'5ml',cost:0.15},{name:'Lime',qty:'½ pc',cost:0.10},{name:'Edamame',qty:'40g',cost:0.25}], active: true },

  // ── Desserts (8) ──────────────────────────────────
  { id: 'd01', name: 'Classic Tiramisu',           categoryId: 'desserts', price: 8.50,  costPrice: 1.75, ingredients: [{name:'Mascarpone',qty:'80g',cost:0.60},{name:'Savoiardi biscuits',qty:'4 pcs',cost:0.30},{name:'Espresso',qty:'30ml',cost:0.15},{name:'Eggs',qty:'1 pc',cost:0.20},{name:'Sugar',qty:'15g',cost:0.05},{name:'Cocoa powder',qty:'5g',cost:0.10},{name:'Marsala wine',qty:'15ml',cost:0.20},{name:'Amaretto',qty:'10ml',cost:0.15}], active: true },
  { id: 'd02', name: 'Crème Brûlée',              categoryId: 'desserts', price: 9.00,  costPrice: 1.50, ingredients: [{name:'Heavy cream',qty:'150ml',cost:0.50},{name:'Egg yolks',qty:'3 pcs',cost:0.40},{name:'Vanilla pod',qty:'½ pc',cost:0.40},{name:'Sugar',qty:'20g',cost:0.10},{name:'Demerara sugar',qty:'10g',cost:0.10}], active: true },
  { id: 'd03', name: 'Chocolate Fondant',          categoryId: 'desserts', price: 10.00, costPrice: 2.10, ingredients: [{name:'Dark chocolate 70%',qty:'80g',cost:0.80},{name:'Butter',qty:'40g',cost:0.30},{name:'Eggs',qty:'2 pcs',cost:0.20},{name:'Sugar',qty:'30g',cost:0.10},{name:'Flour',qty:'20g',cost:0.05},{name:'Vanilla ice cream',qty:'1 scoop',cost:0.50},{name:'Cocoa powder',qty:'5g',cost:0.10},{name:'Mint sprig',qty:'1 pc',cost:0.05}], active: true },
  { id: 'd04', name: 'Vanilla Panna Cotta',        categoryId: 'desserts', price: 8.00,  costPrice: 1.50, ingredients: [{name:'Heavy cream',qty:'150ml',cost:0.50},{name:'Vanilla pod',qty:'½ pc',cost:0.40},{name:'Gelatin',qty:'3g',cost:0.10},{name:'Sugar',qty:'20g',cost:0.05},{name:'Berry compote',qty:'40ml',cost:0.40},{name:'Mint sprig',qty:'1 pc',cost:0.05}], active: true },
  { id: 'd05', name: 'New York Cheesecake',        categoryId: 'desserts', price: 9.00,  costPrice: 2.00, ingredients: [{name:'Cream cheese',qty:'100g',cost:0.80},{name:'Digestive biscuits',qty:'30g',cost:0.20},{name:'Butter',qty:'15g',cost:0.15},{name:'Sugar',qty:'25g',cost:0.10},{name:'Eggs',qty:'1 pc',cost:0.15},{name:'Sour cream',qty:'30ml',cost:0.20},{name:'Berry coulis',qty:'30ml',cost:0.30},{name:'Vanilla',qty:'3ml',cost:0.10}], active: true },
  { id: 'd06', name: 'Seasonal Fruit Sorbet',      categoryId: 'desserts', price: 7.00,  costPrice: 1.30, ingredients: [{name:'Seasonal fruit purée',qty:'120g',cost:0.60},{name:'Sugar syrup',qty:'30ml',cost:0.10},{name:'Lemon juice',qty:'10ml',cost:0.05},{name:'Fresh berries',qty:'40g',cost:0.40},{name:'Mint sprig',qty:'1 pc',cost:0.05},{name:'Wafer',qty:'1 pc',cost:0.10}], active: true },
  { id: 'd07', name: 'Apple Tarte Tatin',          categoryId: 'desserts', price: 9.50,  costPrice: 2.20, ingredients: [{name:'Granny Smith apples',qty:'2 pcs',cost:0.50},{name:'Puff pastry',qty:'80g',cost:0.30},{name:'Butter',qty:'30g',cost:0.25},{name:'Sugar',qty:'30g',cost:0.10},{name:'Cinnamon',qty:'2g',cost:0.05},{name:'Vanilla ice cream',qty:'1 scoop',cost:0.50},{name:'Caramel sauce',qty:'20ml',cost:0.30},{name:'Calvados',qty:'10ml',cost:0.20}], active: true },
  { id: 'd08', name: 'Affogato al Caffè',          categoryId: 'desserts', price: 7.50,  costPrice: 1.40, ingredients: [{name:'Vanilla gelato',qty:'2 scoops',cost:0.60},{name:'Espresso shot',qty:'30ml',cost:0.25},{name:'Amaretto',qty:'15ml',cost:0.30},{name:'Biscotti',qty:'1 pc',cost:0.20},{name:'Cocoa powder',qty:'2g',cost:0.05}], active: true },

  // ── Soft Drinks ───────────────────────────────────
  { id: 'sd01', name: 'Still Mineral Water',       categoryId: 'soft-drinks', price: 3.00,  costPrice: 0.40, ingredients: [{name:'Mineral water',qty:'750ml',cost:0.40}], active: true },
  { id: 'sd02', name: 'Sparkling Water',           categoryId: 'soft-drinks', price: 3.50,  costPrice: 0.50, ingredients: [{name:'Sparkling water',qty:'750ml',cost:0.50}], active: true },
  { id: 'sd03', name: 'Coca-Cola',                 categoryId: 'soft-drinks', price: 3.50,  costPrice: 0.60, ingredients: [{name:'Coca-Cola',qty:'330ml',cost:0.60}], active: true },
  { id: 'sd04', name: 'Coca-Cola Zero',            categoryId: 'soft-drinks', price: 3.50,  costPrice: 0.60, ingredients: [{name:'Coca-Cola Zero',qty:'330ml',cost:0.60}], active: true },
  { id: 'sd05', name: 'Fresh Orange Juice',        categoryId: 'soft-drinks', price: 4.50,  costPrice: 0.90, ingredients: [{name:'Oranges',qty:'4 pcs',cost:0.80},{name:'Ice',qty:'50g',cost:0.05},{name:'Garnish',qty:'1 slice',cost:0.05}], active: true },
  { id: 'sd06', name: 'Homemade Lemonade',         categoryId: 'soft-drinks', price: 4.00,  costPrice: 0.70, ingredients: [{name:'Lemons',qty:'2 pcs',cost:0.30},{name:'Sugar syrup',qty:'20ml',cost:0.10},{name:'Soda water',qty:'200ml',cost:0.15},{name:'Mint',qty:'3g',cost:0.10},{name:'Ice',qty:'50g',cost:0.05}], active: true },
  { id: 'sd07', name: 'Iced Tea',                  categoryId: 'soft-drinks', price: 4.00,  costPrice: 0.40, ingredients: [{name:'Tea',qty:'1 bag',cost:0.10},{name:'Lemon',qty:'2 slices',cost:0.10},{name:'Sugar',qty:'10g',cost:0.05},{name:'Ice',qty:'80g',cost:0.05},{name:'Mint',qty:'3g',cost:0.10}], active: true },
  { id: 'sd08', name: 'Ginger Beer',               categoryId: 'soft-drinks', price: 4.00,  costPrice: 0.70, ingredients: [{name:'Ginger beer',qty:'330ml',cost:0.70}], active: true },
  { id: 'sd09', name: 'Tonic Water',               categoryId: 'soft-drinks', price: 3.50,  costPrice: 0.50, ingredients: [{name:'Premium tonic',qty:'200ml',cost:0.50}], active: true },
  { id: 'sd10', name: 'Apple Juice',               categoryId: 'soft-drinks', price: 4.00,  costPrice: 0.60, ingredients: [{name:'Pressed apple juice',qty:'250ml',cost:0.60}], active: true },

  // ── Wines by Glass ────────────────────────────────
  { id: 'wg01', name: 'House White (Trebbiano)',    categoryId: 'wines-glass', price: 6.00,  costPrice: 1.50, ingredients: [{name:'Trebbiano wine',qty:'175ml',cost:1.50}], active: true },
  { id: 'wg02', name: 'House Red (Montepulciano)',  categoryId: 'wines-glass', price: 6.00,  costPrice: 1.50, ingredients: [{name:'Montepulciano wine',qty:'175ml',cost:1.50}], active: true },
  { id: 'wg03', name: 'Sauvignon Blanc',           categoryId: 'wines-glass', price: 8.00,  costPrice: 2.20, ingredients: [{name:'Sauvignon Blanc wine',qty:'175ml',cost:2.20}], active: true },
  { id: 'wg04', name: 'Chardonnay',                categoryId: 'wines-glass', price: 8.50,  costPrice: 2.40, ingredients: [{name:'Chardonnay wine',qty:'175ml',cost:2.40}], active: true },
  { id: 'wg05', name: 'Pinot Grigio',              categoryId: 'wines-glass', price: 7.50,  costPrice: 2.00, ingredients: [{name:'Pinot Grigio wine',qty:'175ml',cost:2.00}], active: true },
  { id: 'wg06', name: 'Rosé Provence',             categoryId: 'wines-glass', price: 7.50,  costPrice: 2.10, ingredients: [{name:'Rosé Provence wine',qty:'175ml',cost:2.10}], active: true },
  { id: 'wg07', name: 'Merlot',                    categoryId: 'wines-glass', price: 7.00,  costPrice: 1.80, ingredients: [{name:'Merlot wine',qty:'175ml',cost:1.80}], active: true },
  { id: 'wg08', name: 'Cabernet Sauvignon',        categoryId: 'wines-glass', price: 8.00,  costPrice: 2.30, ingredients: [{name:'Cabernet Sauvignon wine',qty:'175ml',cost:2.30}], active: true },
  { id: 'wg09', name: 'Pinot Noir',                categoryId: 'wines-glass', price: 9.00,  costPrice: 2.80, ingredients: [{name:'Pinot Noir wine',qty:'175ml',cost:2.80}], active: true },
  { id: 'wg10', name: 'Prosecco',                  categoryId: 'wines-glass', price: 7.00,  costPrice: 1.80, ingredients: [{name:'Prosecco wine',qty:'125ml',cost:1.80}], active: true },

  // ── Wines by Bottle ───────────────────────────────
  { id: 'wb01', name: 'House White (Trebbiano)',         categoryId: 'wines-bottle', price: 22.00, costPrice: 6.00, ingredients: [{name:'Trebbiano bottle',qty:'750ml',cost:6.00}], active: true },
  { id: 'wb02', name: 'House Red (Montepulciano)',       categoryId: 'wines-bottle', price: 22.00, costPrice: 6.00, ingredients: [{name:'Montepulciano bottle',qty:'750ml',cost:6.00}], active: true },
  { id: 'wb03', name: 'Sauvignon Blanc (Marlborough)',   categoryId: 'wines-bottle', price: 30.00, costPrice: 9.00, ingredients: [{name:'Sauvignon Blanc Marlborough',qty:'750ml',cost:9.00}], active: true },
  { id: 'wb04', name: 'Chardonnay (Burgundy)',           categoryId: 'wines-bottle', price: 34.00, costPrice: 11.00, ingredients: [{name:'Chardonnay Burgundy',qty:'750ml',cost:11.00}], active: true },
  { id: 'wb05', name: 'Pinot Grigio (Veneto)',           categoryId: 'wines-bottle', price: 28.00, costPrice: 8.00, ingredients: [{name:'Pinot Grigio Veneto',qty:'750ml',cost:8.00}], active: true },
  { id: 'wb06', name: 'Prosecco (Valdobbiadene)',        categoryId: 'wines-bottle', price: 30.00, costPrice: 9.50, ingredients: [{name:'Prosecco Valdobbiadene',qty:'750ml',cost:9.50}], active: true },
  { id: 'wb07', name: 'Rosé (Provence)',                 categoryId: 'wines-bottle', price: 32.00, costPrice: 10.00, ingredients: [{name:'Rosé Provence',qty:'750ml',cost:10.00}], active: true },
  { id: 'wb08', name: 'Merlot (Toscana)',                categoryId: 'wines-bottle', price: 28.00, costPrice: 8.50, ingredients: [{name:'Merlot Toscana',qty:'750ml',cost:8.50}], active: true },
  { id: 'wb09', name: 'Cabernet Sauvignon (Napa)',       categoryId: 'wines-bottle', price: 38.00, costPrice: 13.00, ingredients: [{name:'Cabernet Sauvignon Napa',qty:'750ml',cost:13.00}], active: true },
  { id: 'wb10', name: 'Pinot Noir (Burgundy)',           categoryId: 'wines-bottle', price: 36.00, costPrice: 12.00, ingredients: [{name:'Pinot Noir Burgundy',qty:'750ml',cost:12.00}], active: true },
  { id: 'wb11', name: 'Châteauneuf-du-Pape',            categoryId: 'wines-bottle', price: 48.00, costPrice: 18.00, ingredients: [{name:'Châteauneuf-du-Pape',qty:'750ml',cost:18.00}], active: true },
  { id: 'wb12', name: 'Champagne Brut',                 categoryId: 'wines-bottle', price: 55.00, costPrice: 22.00, ingredients: [{name:'Champagne Brut',qty:'750ml',cost:22.00}], active: true },

  // ── Beers ─────────────────────────────────────────
  { id: 'b01', name: 'Draft Lager',                categoryId: 'beers', price: 5.50,  costPrice: 1.20, ingredients: [{name:'Draught lager',qty:'500ml',cost:1.20}], active: true },
  { id: 'b02', name: 'Craft IPA',                  categoryId: 'beers', price: 6.50,  costPrice: 1.80, ingredients: [{name:'Craft IPA bottle',qty:'330ml',cost:1.80}], active: true },
  { id: 'b03', name: 'Pilsner',                    categoryId: 'beers', price: 5.50,  costPrice: 1.20, ingredients: [{name:'Pilsner',qty:'330ml',cost:1.20}], active: true },
  { id: 'b04', name: 'Wheat Beer',                 categoryId: 'beers', price: 6.00,  costPrice: 1.50, ingredients: [{name:'Wheat beer',qty:'500ml',cost:1.50}], active: true },
  { id: 'b05', name: 'Non-Alcoholic Beer',         categoryId: 'beers', price: 5.00,  costPrice: 1.00, ingredients: [{name:'Non-alcoholic beer',qty:'330ml',cost:1.00}], active: true },

  // ── Hot Drinks ────────────────────────────────────
  { id: 'hd01', name: 'Espresso',                  categoryId: 'hot-drinks', price: 2.50,  costPrice: 0.30, ingredients: [{name:'Espresso coffee',qty:'30ml',cost:0.20},{name:'Sugar sachet',qty:'1 pc',cost:0.05},{name:'Biscuit',qty:'1 pc',cost:0.05}], active: true },
  { id: 'hd02', name: 'Double Espresso',           categoryId: 'hot-drinks', price: 3.50,  costPrice: 0.45, ingredients: [{name:'Double espresso coffee',qty:'60ml',cost:0.35},{name:'Sugar sachet',qty:'1 pc',cost:0.05},{name:'Biscuit',qty:'1 pc',cost:0.05}], active: true },
  { id: 'hd03', name: 'Cappuccino',                categoryId: 'hot-drinks', price: 3.50,  costPrice: 0.50, ingredients: [{name:'Espresso coffee',qty:'30ml',cost:0.20},{name:'Milk',qty:'150ml',cost:0.15},{name:'Cocoa dusting',qty:'2g',cost:0.05},{name:'Sugar sachet',qty:'1 pc',cost:0.05},{name:'Biscuit',qty:'1 pc',cost:0.05}], active: true },
  { id: 'hd04', name: 'Café Latte',                categoryId: 'hot-drinks', price: 4.00,  costPrice: 0.50, ingredients: [{name:'Espresso coffee',qty:'30ml',cost:0.20},{name:'Steamed milk',qty:'200ml',cost:0.20},{name:'Sugar sachet',qty:'1 pc',cost:0.05},{name:'Biscuit',qty:'1 pc',cost:0.05}], active: true },
  { id: 'hd05', name: 'English Breakfast Tea',     categoryId: 'hot-drinks', price: 3.00,  costPrice: 0.30, ingredients: [{name:'Tea bag',qty:'1 pc',cost:0.10},{name:'Milk',qty:'30ml',cost:0.10},{name:'Sugar sachet',qty:'1 pc',cost:0.05},{name:'Biscuit',qty:'1 pc',cost:0.05}], active: true },
  { id: 'hd06', name: 'Herbal Tea',                categoryId: 'hot-drinks', price: 3.00,  costPrice: 0.30, ingredients: [{name:'Herbal tea bag',qty:'1 pc',cost:0.15},{name:'Honey',qty:'10ml',cost:0.10},{name:'Lemon',qty:'1 slice',cost:0.05}], active: true },
  { id: 'hd07', name: 'Hot Chocolate',             categoryId: 'hot-drinks', price: 4.00,  costPrice: 0.60, ingredients: [{name:'Chocolate powder',qty:'25g',cost:0.20},{name:'Steamed milk',qty:'200ml',cost:0.15},{name:'Whipped cream',qty:'20ml',cost:0.10},{name:'Marshmallows',qty:'4 pcs',cost:0.10},{name:'Cocoa dusting',qty:'2g',cost:0.05}], active: true },
];

// ── Default Staff (7 servers) ───────────────────────────────
// ── Default Pantry (master ingredient inventory) ────────────
// packCost = how much you pay for the pack
// recipeUnitsPerPack = how many recipe units in the pack
// unitCost = packCost / recipeUnitsPerPack (auto-calculated)
const DEFAULT_PANTRY = [
  {id:'p001',name:'Aioli sauce',packSize:1,packUnit:'jar',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p002',name:'Almonds',packSize:1,packUnit:'bag',packCost:6.67,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p003',name:'Amaretto',packSize:1,packUnit:'bottle',packCost:14.00,recipeUnit:'ml',recipeUnitsPerPack:700},
  {id:'p004',name:'Anchovy fillets',packSize:1,packUnit:'tin',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:30},
  {id:'p005',name:'Apple purée',packSize:1,packUnit:'jar',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p006',name:'Arborio rice',packSize:1,packUnit:'bag',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p007',name:'Asian salad',packSize:1,packUnit:'bag',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:300},
  {id:'p008',name:'Asparagus',packSize:1,packUnit:'bunch',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p009',name:'Aubergine',packSize:1,packUnit:'kg',packCost:3.75,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p010',name:'Avocado',packSize:1,packUnit:'case',packCost:7.20,recipeUnit:'pc',recipeUnitsPerPack:12},
  {id:'p011',name:'Bacon',packSize:1,packUnit:'pack',packCost:4.00,recipeUnit:'rasher',recipeUnitsPerPack:20},
  {id:'p012',name:'Baguette',packSize:1,packUnit:'baguette',packCost:1.50,recipeUnit:'slice',recipeUnitsPerPack:20},
  {id:'p013',name:'Balsamic glaze',packSize:1,packUnit:'bottle',packCost:7.50,recipeUnit:'ml',recipeUnitsPerPack:250},
  {id:'p014',name:'Balsamic reduction',packSize:1,packUnit:'bottle',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:250},
  {id:'p015',name:'Beef fillet',packSize:1,packUnit:'kg',packCost:26.67,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p016',name:'Beef patty',packSize:8,packUnit:'pc',packCost:16.00,recipeUnit:'g',recipeUnitsPerPack:1600},
  {id:'p017',name:'Beef stock',packSize:1,packUnit:'carton',packCost:1.60,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p018',name:'Beef tenderloin',packSize:1,packUnit:'kg',packCost:30.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p019',name:'Berry compote',packSize:1,packUnit:'jar',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p020',name:'Berry coulis',packSize:1,packUnit:'bottle',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p021',name:'Biscotti',packSize:1,packUnit:'box',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p022',name:'Biscuit',packSize:1,packUnit:'box',packCost:5.00,recipeUnit:'pc',recipeUnitsPerPack:100},
  {id:'p023',name:'Bisque sauce',packSize:1,packUnit:'jar',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p024',name:'Bok choy',packSize:1,packUnit:'bunch',packCost:1.50,recipeUnit:'g',recipeUnitsPerPack:300},
  {id:'p025',name:'Bread roll',packSize:1,packUnit:'bag',packCost:1.80,recipeUnit:'pc',recipeUnitsPerPack:12},
  {id:'p026',name:'Breadcrumbs',packSize:1,packUnit:'bag',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p027',name:'Brioche bun',packSize:1,packUnit:'pack',packCost:3.20,recipeUnit:'pc',recipeUnitsPerPack:8},
  {id:'p028',name:'Buffalo mozzarella',packSize:1,packUnit:'ball',packCost:1.40,recipeUnit:'g',recipeUnitsPerPack:125},
  {id:'p029',name:'Butter',packSize:1,packUnit:'block',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p030',name:'Cabernet Sauvignon Napa',packSize:1,packUnit:'bottle',packCost:13.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p031',name:'Cabernet Sauvignon wine',packSize:1,packUnit:'bottle',packCost:9.86,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p032',name:'Caesar dressing',packSize:1,packUnit:'bottle',packCost:3.50,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p033',name:'Calvados',packSize:1,packUnit:'bottle',packCost:14.00,recipeUnit:'ml',recipeUnitsPerPack:700},
  {id:'p034',name:'Capers',packSize:1,packUnit:'jar',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p035',name:'Caramel sauce',packSize:1,packUnit:'bottle',packCost:7.50,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p036',name:'Celeriac mash',packSize:1,packUnit:'tub',packCost:3.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p037',name:'Champagne Brut',packSize:1,packUnit:'bottle',packCost:22.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p038',name:'Chardonnay Burgundy',packSize:1,packUnit:'bottle',packCost:11.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p039',name:'Chardonnay wine',packSize:1,packUnit:'bottle',packCost:10.29,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p040',name:'Cheddar cheese',packSize:1,packUnit:'block',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p041',name:'Cherry tomatoes',packSize:1,packUnit:'punnet',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p042',name:'Chicken jus',packSize:1,packUnit:'tub',packCost:3.75,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p043',name:'Chicken supreme',packSize:1,packUnit:'kg',packCost:11.36,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p044',name:'Chickpeas',packSize:1,packUnit:'tin',packCost:1.50,recipeUnit:'g',recipeUnitsPerPack:400},
  {id:'p045',name:'Chilli',packSize:1,packUnit:'pack',packCost:3.33,recipeUnit:'g',recipeUnitsPerPack:100},
  {id:'p046',name:'Chilli flakes',packSize:1,packUnit:'jar',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:100},
  {id:'p047',name:'Chocolate powder',packSize:1,packUnit:'tin',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p048',name:'Châteauneuf-du-Pape',packSize:1,packUnit:'bottle',packCost:18.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p049',name:'Ciabatta bread',packSize:1,packUnit:'loaf',packCost:2.40,recipeUnit:'slice',recipeUnitsPerPack:12},
  {id:'p050',name:'Cider jus',packSize:1,packUnit:'tub',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p051',name:'Cinnamon',packSize:1,packUnit:'jar',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:100},
  {id:'p052',name:'Coca-Cola',packSize:24,packUnit:'can',packCost:14.40,recipeUnit:'ml',recipeUnitsPerPack:7920},
  {id:'p053',name:'Coca-Cola Zero',packSize:24,packUnit:'can',packCost:14.40,recipeUnit:'ml',recipeUnitsPerPack:7920},
  {id:'p054',name:'Cocoa dusting',packSize:1,packUnit:'tin',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p055',name:'Cocoa powder',packSize:1,packUnit:'tin',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p056',name:'Coppa',packSize:1,packUnit:'pack',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p057',name:'Coriander',packSize:1,packUnit:'bunch',packCost:0.60,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p058',name:'Cornichons',packSize:1,packUnit:'jar',packCost:2.53,recipeUnit:'g',recipeUnitsPerPack:380},
  {id:'p059',name:'Courgette',packSize:1,packUnit:'kg',packCost:3.13,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p060',name:'Couscous',packSize:1,packUnit:'bag',packCost:1.56,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p061',name:'Crackling',packSize:1,packUnit:'pack',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p062',name:'Craft IPA bottle',packSize:24,packUnit:'bottle',packCost:43.20,recipeUnit:'ml',recipeUnitsPerPack:7920},
  {id:'p063',name:'Cream',packSize:1,packUnit:'carton',packCost:3.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p064',name:'Cream cheese',packSize:1,packUnit:'tub',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p065',name:'Croutons',packSize:1,packUnit:'bag',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p066',name:'Dark chocolate 70%',packSize:1,packUnit:'bar',packCost:2.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p067',name:'Dauphinoise potatoes',packSize:1,packUnit:'tray',packCost:5.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p068',name:'Demerara sugar',packSize:1,packUnit:'bag',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p069',name:'Digestive biscuits',packSize:1,packUnit:'pack',packCost:2.00,recipeUnit:'g',recipeUnitsPerPack:300},
  {id:'p070',name:'Dill',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p071',name:'Double espresso coffee',packSize:1,packUnit:'bag',packCost:5.83,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p072',name:'Draught lager',packSize:1,packUnit:'keg',packCost:72.00,recipeUnit:'ml',recipeUnitsPerPack:30000},
  {id:'p073',name:'Duck breast',packSize:1,packUnit:'kg',packCost:21.82,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p074',name:'Edamame',packSize:1,packUnit:'bag',packCost:3.13,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p075',name:'Egg',packSize:1,packUnit:'dozen',packCost:1.80,recipeUnit:'pc',recipeUnitsPerPack:12},
  {id:'p076',name:'Egg yolks',packSize:1,packUnit:'dozen',packCost:1.60,recipeUnit:'pc',recipeUnitsPerPack:12},
  {id:'p077',name:'Eggs',packSize:1,packUnit:'dozen',packCost:1.80,recipeUnit:'pc',recipeUnitsPerPack:12},
  {id:'p078',name:'Espresso coffee',packSize:1,packUnit:'bag',packCost:6.67,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p079',name:'Espresso shot',packSize:1,packUnit:'bag',packCost:8.33,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p080',name:'Field mushroom',packSize:1,packUnit:'punnet',packCost:1.80,recipeUnit:'pc',recipeUnitsPerPack:6},
  {id:'p081',name:'Fig jam',packSize:1,packUnit:'jar',packCost:3.40,recipeUnit:'g',recipeUnitsPerPack:340},
  {id:'p082',name:'Flour',packSize:1,packUnit:'bag',packCost:3.75,recipeUnit:'g',recipeUnitsPerPack:1500},
  {id:'p083',name:'Focaccia',packSize:1,packUnit:'loaf',packCost:1.50,recipeUnit:'slice',recipeUnitsPerPack:10},
  {id:'p084',name:'Fondant potato',packSize:1,packUnit:'tub',packCost:3.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p085',name:'Fresh basil',packSize:1,packUnit:'bunch',packCost:1.20,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p086',name:'Fresh berries',packSize:1,packUnit:'punnet',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p087',name:'Frying oil',packSize:5,packUnit:'L',packCost:20.00,recipeUnit:'ml',recipeUnitsPerPack:5000},
  {id:'p088',name:'Garlic',packSize:1,packUnit:'bulb',packCost:0.50,recipeUnit:'clove',recipeUnitsPerPack:10},
  {id:'p089',name:'Garlic butter',packSize:1,packUnit:'tub',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p090',name:'Garnish',packSize:1,packUnit:'pack',packCost:1.00,recipeUnit:'slice',recipeUnitsPerPack:20},
  {id:'p091',name:'Gelatin',packSize:1,packUnit:'pack',packCost:2.00,recipeUnit:'g',recipeUnitsPerPack:60},
  {id:'p092',name:'Ginger',packSize:1,packUnit:'piece',packCost:2.00,recipeUnit:'g',recipeUnitsPerPack:100},
  {id:'p093',name:'Ginger beer',packSize:24,packUnit:'can',packCost:16.80,recipeUnit:'ml',recipeUnitsPerPack:7920},
  {id:'p094',name:'Granny Smith apples',packSize:1,packUnit:'case',packCost:6.00,recipeUnit:'pc',recipeUnitsPerPack:24},
  {id:'p095',name:'Green beans',packSize:1,packUnit:'kg',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p096',name:'Grilled artichokes',packSize:1,packUnit:'jar',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:300},
  {id:'p097',name:'Grilled tomato',packSize:1,packUnit:'box',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p098',name:'Grilled vegetables',packSize:1,packUnit:'tub',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p099',name:'Gruyère cheese',packSize:1,packUnit:'wedge',packCost:7.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p100',name:'Hand-cut fries',packSize:1,packUnit:'bag',packCost:8.32,recipeUnit:'g',recipeUnitsPerPack:2500},
  {id:'p101',name:'Harissa',packSize:1,packUnit:'jar',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p102',name:'Heavy cream',packSize:1,packUnit:'carton',packCost:1.67,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p103',name:'Herb crust',packSize:1,packUnit:'tub',packCost:4.50,recipeUnit:'g',recipeUnitsPerPack:300},
  {id:'p104',name:'Herbal tea bag',packSize:1,packUnit:'box',packCost:7.50,recipeUnit:'pc',recipeUnitsPerPack:50},
  {id:'p105',name:'Herbs',packSize:1,packUnit:'bunch',packCost:0.60,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p106',name:'Hollandaise sauce',packSize:1,packUnit:'tub',packCost:7.50,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p107',name:'Honey',packSize:1,packUnit:'jar',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p108',name:'Horseradish cream',packSize:1,packUnit:'jar',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p109',name:'House sauce',packSize:1,packUnit:'bottle',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p110',name:'Ice',packSize:1,packUnit:'bag',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:5000},
  {id:'p111',name:'Iceberg lettuce',packSize:1,packUnit:'head',packCost:2.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p112',name:'King prawns',packSize:1,packUnit:'kg',packCost:23.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p113',name:'Lamb jus',packSize:1,packUnit:'tub',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p114',name:'Lamb rack',packSize:1,packUnit:'rack',packCost:17.33,recipeUnit:'cutlet',recipeUnitsPerPack:8},
  {id:'p115',name:'Lemon',packSize:1,packUnit:'net',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p116',name:'Lemon butter sauce',packSize:1,packUnit:'tub',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p117',name:'Lemon juice',packSize:1,packUnit:'bottle',packCost:2.50,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p118',name:'Lemons',packSize:1,packUnit:'net',packCost:3.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p119',name:'Lettuce & tomato',packSize:1,packUnit:'pack',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p120',name:'Lime',packSize:1,packUnit:'net',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p121',name:'Linguine pasta',packSize:1,packUnit:'pack',packCost:1.67,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p122',name:'Lobster tail',packSize:1,packUnit:'kg',packCost:46.67,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p123',name:'Marie Rose sauce',packSize:1,packUnit:'jar',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p124',name:'Marsala wine',packSize:1,packUnit:'bottle',packCost:10.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p125',name:'Marshmallows',packSize:1,packUnit:'bag',packCost:2.50,recipeUnit:'pc',recipeUnitsPerPack:100},
  {id:'p126',name:'Mascarpone',packSize:1,packUnit:'tub',packCost:1.88,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p127',name:'Mashed potato',packSize:1,packUnit:'tub',packCost:2.78,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p128',name:'Merlot Toscana',packSize:1,packUnit:'bottle',packCost:8.50,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p129',name:'Merlot wine',packSize:1,packUnit:'bottle',packCost:7.71,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p130',name:'Milk',packSize:1,packUnit:'carton',packCost:1.00,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p131',name:'Mineral water',packSize:1,packUnit:'bottle',packCost:0.40,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p132',name:'Mint',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p133',name:'Mint sprig',packSize:1,packUnit:'bunch',packCost:1.50,recipeUnit:'pc',recipeUnitsPerPack:30},
  {id:'p134',name:'Mixed mushrooms',packSize:1,packUnit:'punnet',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p135',name:'Mixed nuts',packSize:1,packUnit:'bag',packCost:4.17,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p136',name:'Mixed wild mushrooms',packSize:1,packUnit:'punnet',packCost:1.67,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p137',name:'Montepulciano bottle',packSize:1,packUnit:'bottle',packCost:6.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p138',name:'Montepulciano wine',packSize:1,packUnit:'bottle',packCost:6.43,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p139',name:'Mustard',packSize:1,packUnit:'jar',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:300},
  {id:'p140',name:'New potatoes',packSize:1,packUnit:'bag',packCost:5.34,recipeUnit:'g',recipeUnitsPerPack:2000},
  {id:'p141',name:'Non-alcoholic beer',packSize:24,packUnit:'bottle',packCost:24.00,recipeUnit:'ml',recipeUnitsPerPack:7920},
  {id:'p142',name:'Olive oil',packSize:1,packUnit:'bottle',packCost:20.00,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p143',name:'Olive oil EV',packSize:1,packUnit:'bottle',packCost:10.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p144',name:'Olives',packSize:1,packUnit:'jar',packCost:3.75,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p145',name:'Onion rings',packSize:1,packUnit:'bag',packCost:3.00,recipeUnit:'pc',recipeUnitsPerPack:30},
  {id:'p146',name:'Orange sauce',packSize:1,packUnit:'jar',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p147',name:'Orange segments',packSize:1,packUnit:'jar',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p148',name:'Oranges',packSize:1,packUnit:'net',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:20},
  {id:'p149',name:'Paprika',packSize:1,packUnit:'jar',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:100},
  {id:'p150',name:'Parmesan',packSize:1,packUnit:'wedge',packCost:10.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p151',name:'Parmesan shavings',packSize:1,packUnit:'wedge',packCost:10.00,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p152',name:'Parsley',packSize:1,packUnit:'bunch',packCost:0.60,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p153',name:'Peppercorn sauce',packSize:1,packUnit:'tub',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p154',name:'Pickled ginger',packSize:1,packUnit:'jar',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p155',name:'Pickles',packSize:1,packUnit:'jar',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p156',name:'Pilaf rice',packSize:1,packUnit:'tub',packCost:2.67,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p157',name:'Pilsner',packSize:24,packUnit:'bottle',packCost:28.80,recipeUnit:'ml',recipeUnitsPerPack:7920},
  {id:'p158',name:'Pinot Grigio Veneto',packSize:1,packUnit:'bottle',packCost:8.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p159',name:'Pinot Grigio wine',packSize:1,packUnit:'bottle',packCost:8.57,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p160',name:'Pinot Noir Burgundy',packSize:1,packUnit:'bottle',packCost:12.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p161',name:'Pinot Noir wine',packSize:1,packUnit:'bottle',packCost:12.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p162',name:'Pork belly',packSize:1,packUnit:'kg',packCost:11.20,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p163',name:'Premium tonic',packSize:24,packUnit:'bottle',packCost:12.00,recipeUnit:'ml',recipeUnitsPerPack:4800},
  {id:'p164',name:'Preserved lemon',packSize:1,packUnit:'jar',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p165',name:'Pressed apple juice',packSize:1,packUnit:'carton',packCost:2.40,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p166',name:'Prosciutto',packSize:1,packUnit:'pack',packCost:4.80,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p167',name:'Prosecco Valdobbiadene',packSize:1,packUnit:'bottle',packCost:9.50,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p168',name:'Prosecco wine',packSize:1,packUnit:'bottle',packCost:10.80,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p169',name:'Puff pastry',packSize:1,packUnit:'roll',packCost:3.75,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p170',name:'Ras el hanout',packSize:1,packUnit:'jar',packCost:3.20,recipeUnit:'g',recipeUnitsPerPack:80},
  {id:'p171',name:'Ratatouille',packSize:1,packUnit:'tub',packCost:3.34,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p172',name:'Red onion',packSize:1,packUnit:'kg',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p173',name:'Red wine jus',packSize:1,packUnit:'tub',packCost:6.67,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p174',name:'Ribeye steak',packSize:1,packUnit:'kg',packCost:23.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p175',name:'Rocket',packSize:1,packUnit:'bag',packCost:1.50,recipeUnit:'g',recipeUnitsPerPack:150},
  {id:'p176',name:'Rocket salad',packSize:1,packUnit:'bag',packCost:1.50,recipeUnit:'g',recipeUnitsPerPack:150},
  {id:'p177',name:'Romaine lettuce',packSize:1,packUnit:'case',packCost:3.00,recipeUnit:'head',recipeUnitsPerPack:6},
  {id:'p178',name:'Rosemary',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p179',name:'Rosé Provence',packSize:1,packUnit:'bottle',packCost:10.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p180',name:'Rosé Provence wine',packSize:1,packUnit:'bottle',packCost:9.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p181',name:'Saffron risotto',packSize:1,packUnit:'portion',packCost:0.90,recipeUnit:'g',recipeUnitsPerPack:160},
  {id:'p182',name:'Sage',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p183',name:'Salami Napoli',packSize:1,packUnit:'pack',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p184',name:'Salmon fillet',packSize:1,packUnit:'kg',packCost:20.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p185',name:'Salt & pepper',packSize:1,packUnit:'pack',packCost:8.34,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p186',name:'Samphire',packSize:1,packUnit:'punnet',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p187',name:'Sauvignon Blanc Marlborough',packSize:1,packUnit:'bottle',packCost:9.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p188',name:'Sauvignon Blanc wine',packSize:1,packUnit:'bottle',packCost:9.43,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p189',name:'Savoiardi biscuits',packSize:1,packUnit:'pack',packCost:1.80,recipeUnit:'pc',recipeUnitsPerPack:24},
  {id:'p190',name:'Savoy cabbage',packSize:1,packUnit:'head',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p191',name:'Sea bass fillet',packSize:1,packUnit:'kg',packCost:26.67,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p192',name:'Seasonal fruit purée',packSize:1,packUnit:'tub',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p193',name:'Seasonal greens',packSize:1,packUnit:'bag',packCost:3.13,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p194',name:'Seasonal vegetables',packSize:1,packUnit:'kg',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p195',name:'Seasoning',packSize:1,packUnit:'pack',packCost:8.34,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p196',name:'Semolina flour',packSize:1,packUnit:'bag',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p197',name:'Sesame crust',packSize:1,packUnit:'bag',packCost:7.50,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p198',name:'Sesame oil',packSize:1,packUnit:'bottle',packCost:7.50,recipeUnit:'ml',recipeUnitsPerPack:250},
  {id:'p199',name:'Sesame seeds',packSize:1,packUnit:'bag',packCost:5.00,recipeUnit:'g',recipeUnitsPerPack:250},
  {id:'p200',name:'Shallots',packSize:1,packUnit:'bag',packCost:2.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p201',name:'Smoked salmon',packSize:1,packUnit:'pack',packCost:7.00,recipeUnit:'g',recipeUnitsPerPack:200},
  {id:'p202',name:'Soda water',packSize:1,packUnit:'bottle',packCost:0.75,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p203',name:'Sour cream',packSize:1,packUnit:'tub',packCost:2.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p204',name:'Soy glaze',packSize:1,packUnit:'bottle',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p205',name:'Soy sauce',packSize:1,packUnit:'bottle',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p206',name:'Spaghetti',packSize:1,packUnit:'pack',packCost:1.50,recipeUnit:'g',recipeUnitsPerPack:500},
  {id:'p207',name:'Sparkling water',packSize:1,packUnit:'bottle',packCost:0.50,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p208',name:'Spring onion',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:100},
  {id:'p209',name:'Squid tubes',packSize:1,packUnit:'kg',packCost:8.89,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p210',name:'Star anise',packSize:1,packUnit:'pack',packCost:3.00,recipeUnit:'pc',recipeUnitsPerPack:30},
  {id:'p211',name:'Steamed milk',packSize:1,packUnit:'carton',packCost:1.00,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p212',name:'Stock',packSize:1,packUnit:'carton',packCost:1.00,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p213',name:'Sugar',packSize:1,packUnit:'bag',packCost:3.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p214',name:'Sugar sachet',packSize:1,packUnit:'box',packCost:10.00,recipeUnit:'pc',recipeUnitsPerPack:200},
  {id:'p215',name:'Sugar syrup',packSize:1,packUnit:'bottle',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p216',name:'Sushi-grade tuna',packSize:1,packUnit:'kg',packCost:28.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p217',name:'Sweet potato',packSize:1,packUnit:'kg',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p218',name:'Sweet potato purée',packSize:1,packUnit:'tub',packCost:3.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p219',name:'Tarragon',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p220',name:'Tea',packSize:1,packUnit:'box',packCost:10.00,recipeUnit:'bag',recipeUnitsPerPack:100},
  {id:'p221',name:'Tea bag',packSize:1,packUnit:'box',packCost:10.00,recipeUnit:'pc',recipeUnitsPerPack:100},
  {id:'p222',name:'Thyme',packSize:1,packUnit:'bunch',packCost:1.00,recipeUnit:'g',recipeUnitsPerPack:30},
  {id:'p223',name:'Tiger prawns',packSize:1,packUnit:'bag',packCost:11.00,recipeUnit:'pc',recipeUnitsPerPack:12},
  {id:'p224',name:'Toast points',packSize:1,packUnit:'pack',packCost:2.50,recipeUnit:'pc',recipeUnitsPerPack:50},
  {id:'p225',name:'Tomato sauce',packSize:1,packUnit:'jar',packCost:3.34,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p226',name:'Tomatoes',packSize:1,packUnit:'kg',packCost:3.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p227',name:'Trebbiano bottle',packSize:1,packUnit:'bottle',packCost:6.00,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p228',name:'Trebbiano wine',packSize:1,packUnit:'bottle',packCost:6.43,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p229',name:'Triple-cooked chips',packSize:1,packUnit:'bag',packCost:8.32,recipeUnit:'g',recipeUnitsPerPack:2500},
  {id:'p230',name:'Truffle oil',packSize:1,packUnit:'bottle',packCost:5.00,recipeUnit:'ml',recipeUnitsPerPack:100},
  {id:'p231',name:'Vanilla',packSize:1,packUnit:'bottle',packCost:3.33,recipeUnit:'ml',recipeUnitsPerPack:100},
  {id:'p232',name:'Vanilla gelato',packSize:1,packUnit:'tub',packCost:7.20,recipeUnit:'scoop',recipeUnitsPerPack:24},
  {id:'p233',name:'Vanilla ice cream',packSize:1,packUnit:'tub',packCost:12.00,recipeUnit:'scoop',recipeUnitsPerPack:24},
  {id:'p234',name:'Vanilla pod',packSize:5,packUnit:'pc',packCost:4.00,recipeUnit:'pc',recipeUnitsPerPack:5},
  {id:'p235',name:'Veal escalope',packSize:1,packUnit:'kg',packCost:22.50,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p236',name:'Vegetable stock',packSize:1,packUnit:'carton',packCost:0.86,recipeUnit:'ml',recipeUnitsPerPack:1000},
  {id:'p237',name:'Vine tomatoes',packSize:1,packUnit:'kg',packCost:3.33,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p238',name:'Wafer',packSize:1,packUnit:'pack',packCost:5.00,recipeUnit:'pc',recipeUnitsPerPack:50},
  {id:'p239',name:'Wasabi mash',packSize:1,packUnit:'tub',packCost:4.00,recipeUnit:'g',recipeUnitsPerPack:1000},
  {id:'p240',name:'Watercress',packSize:1,packUnit:'bunch',packCost:1.07,recipeUnit:'g',recipeUnitsPerPack:80},
  {id:'p241',name:'Wheat beer',packSize:24,packUnit:'bottle',packCost:36.00,recipeUnit:'ml',recipeUnitsPerPack:12000},
  {id:'p242',name:'Whipped cream',packSize:1,packUnit:'can',packCost:2.50,recipeUnit:'ml',recipeUnitsPerPack:500},
  {id:'p243',name:'White wine',packSize:1,packUnit:'bottle',packCost:3.75,recipeUnit:'ml',recipeUnitsPerPack:750},
  {id:'p244',name:'Wild mushroom cream sauce',packSize:1,packUnit:'tub',packCost:4.00,recipeUnit:'ml',recipeUnitsPerPack:300},
  {id:'p245',name:'Wonton crisps',packSize:1,packUnit:'pack',packCost:1.50,recipeUnit:'pc',recipeUnitsPerPack:40},
  {id:'p246',name:'Yellow onions',packSize:1,packUnit:'bag',packCost:5.01,recipeUnit:'g',recipeUnitsPerPack:3000},
  {id:'p247',name:'Yellowfin tuna steak',packSize:1,packUnit:'kg',packCost:27.78,recipeUnit:'g',recipeUnitsPerPack:1000},
];

const DEFAULT_STAFF = [
  { id: 'staff_1', name: 'Elena Rossi',      role: 'Head Server', active: true },
  { id: 'staff_2', name: 'Marco Fernandez',  role: 'Server',      active: true },
  { id: 'staff_3', name: 'Sarah Mitchell',   role: 'Server',      active: true },
  { id: 'staff_4', name: 'Alexander Dubois', role: 'Server',      active: true },
  { id: 'staff_5', name: 'Yuki Tanaka',      role: 'Bartender',   active: true },
  { id: 'staff_6', name: 'Liam O\'Connor',   role: 'Server',      active: true },
  { id: 'staff_7', name: 'Amara Okafor',     role: 'Server',      active: true },
];

// Restaurant settings defaults
const DEFAULT_SETTINGS = {
  restaurantName: 'My Restaurant',
  currency: '€',
  taxRate: 0,
  serviceCharge: 0,
  vatRate: 13,            // VAT % on selling prices (13% reduced rate common for food in EU)
  dayStartHour: 10,
  dayEndHour: 2,
};

// ═══════════════════════════════════════════════════════════
//  DEMO DAY GENERATOR — Creates a realistic busy day (~€10,000)
// ═══════════════════════════════════════════════════════════
function generateDemoDay() {
  const today = Store.getBusinessDate();
  const menu = Store.getMenu();
  const staff = Store.getStaff();
  if (staff.length === 0 || menu.length === 0) return [];

  const staffIds = staff.filter(s => s.active).map(s => s.id);

  // Helper: pick random items from a category
  function pickItems(catId, min, max) {
    const catItems = menu.filter(m => m.active && m.categoryId === catId);
    if (catItems.length === 0) return [];
    const count = min + Math.floor(Math.random() * (max - min + 1));
    const picked = [];
    for (let i = 0; i < count; i++) {
      const item = catItems[Math.floor(Math.random() * catItems.length)];
      picked.push({
        menuItemId: item.id,
        name: item.name,
        categoryId: item.categoryId,
        price: item.price,
        costPrice: item.costPrice || 0,
        quantity: 1,
      });
    }
    const merged = {};
    picked.forEach(p => {
      if (merged[p.menuItemId]) merged[p.menuItemId].quantity++;
      else merged[p.menuItemId] = { ...p };
    });
    return Object.values(merged);
  }

  const orders = [];
  const serviceHours = [
    { start: 12, end: 14, count: 28, coversMin: 2, coversMax: 4, wineChance: 0.4, bottleChance: 0.15 },
    { start: 15, end: 17, count: 8,  coversMin: 1, coversMax: 2, wineChance: 0.3, bottleChance: 0.05 },
    { start: 18, end: 22, count: 42, coversMin: 2, coversMax: 6, wineChance: 0.7, bottleChance: 0.4 },
  ];

  let ordIdx = 0;
  serviceHours.forEach(svc => {
    for (let i = 0; i < svc.count; i++) {
      const hour = svc.start + Math.floor(Math.random() * (svc.end - svc.start));
      const minute = Math.floor(Math.random() * 60);
      const covers = svc.coversMin + Math.floor(Math.random() * (svc.coversMax - svc.coversMin + 1));
      const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];
      const tableNum = 1 + Math.floor(Math.random() * 20);

      let items = [];
      for (let c = 0; c < covers; c++) {
        if (Math.random() < 0.8) items = items.concat(pickItems('starters', 1, 1));
        items = items.concat(pickItems('mains', 1, 1));
        if (Math.random() < 0.6) items = items.concat(pickItems('desserts', 1, 1));
      }
      if (Math.random() < 0.6) items = items.concat(pickItems('soft-drinks', 1, Math.min(covers, 3)));
      if (Math.random() < svc.wineChance) {
        if (Math.random() < svc.bottleChance)
          items = items.concat(pickItems('wines-bottle', 1, 1));
        else
          items = items.concat(pickItems('wines-glass', 1, Math.min(covers, 4)));
      }
      if (Math.random() < 0.25) items = items.concat(pickItems('beers', 1, 2));
      if (hour >= 18 && Math.random() < 0.5)
        items = items.concat(pickItems('hot-drinks', 1, Math.min(covers, 3)));

      const merged = {};
      items.forEach(it => {
        if (merged[it.menuItemId]) merged[it.menuItemId].quantity += it.quantity;
        else merged[it.menuItemId] = { ...it };
      });
      const finalItems = Object.values(merged);

      const subtotal = finalItems.reduce((s, it) => s + it.price * it.quantity, 0);
      const totalCost = finalItems.reduce((s, it) => s + (it.costPrice || 0) * it.quantity, 0);

      const createdAt = new Date(`${today}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00`).toISOString();
      const closedAt = new Date(new Date(createdAt).getTime() + (40 + Math.floor(Math.random() * 50)) * 60000).toISOString();

      orders.push({
        id: `demo_ord_${String(ordIdx++).padStart(3, '0')}`,
        staffId,
        tableNumber: tableNum,
        covers,
        items: finalItems,
        subtotal,
        totalCost,
        tax: 0,
        serviceCharge: 0,
        total: subtotal,
        status: 'closed',
        createdAt,
        closedAt,
      });
    }
  });

  // Save orders
  const existingOrders = Store.getOrders();
  const cleanOrders = existingOrders.filter(o => !o.id.startsWith('demo_ord_'));
  Store.saveOrders([...cleanOrders, ...orders]);

  // Generate time clock records based on which staff had orders
  const staffShifts = {};
  orders.forEach(o => {
    if (!staffShifts[o.staffId]) staffShifts[o.staffId] = { first: o.createdAt, last: o.closedAt };
    if (o.createdAt < staffShifts[o.staffId].first) staffShifts[o.staffId].first = o.createdAt;
    if (o.closedAt > staffShifts[o.staffId].last) staffShifts[o.staffId].last = o.closedAt;
  });

  const clockRecords = [];
  Object.keys(staffShifts).forEach((staffId, idx) => {
    const sh = staffShifts[staffId];
    // Clock in 15-30 min before first order
    const clockIn = new Date(new Date(sh.first).getTime() - (15 + Math.floor(Math.random() * 16)) * 60000).toISOString();
    // Clock out 10-25 min after last order closed
    const clockOut = new Date(new Date(sh.last).getTime() + (10 + Math.floor(Math.random() * 16)) * 60000).toISOString();
    clockRecords.push({
      id: 'tc_demo_' + idx,
      staffId,
      clockIn,
      clockOut,
      status: 'pending',
      openTables: 0,
    });
  });
  Store.saveTimeClock(clockRecords);

  return orders;
}
