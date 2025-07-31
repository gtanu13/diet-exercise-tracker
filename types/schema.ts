export interface FoodItem {
  id: number;             // auto-incremented
  food: string;           // maps to 'name' in CSV
  quantity: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  category: string;
}

export interface AppDatabase {
  food_items: FoodItem;
}