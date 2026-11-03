import type { CookingResult } from './types';
export default class TotkCookSim {
  constructor(data: unknown);
  cook(ingredients: string[]): CookingResult;
}
