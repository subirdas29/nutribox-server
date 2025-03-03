import { IMealProvider, } from "./provider.interface";
import { MealProvider } from "./provider.model";




const mealProvider = async (payload: IMealProvider) => {
  const result = await MealProvider.create(payload);
  return result;
};

export const mealProviderServices = {
  mealProvider
};