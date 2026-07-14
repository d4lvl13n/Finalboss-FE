// Local mirror of the EntityDetail view-model contract.
//
// ASSUMPTION: the game-hub provider (app/lib/game-hub) supplies this shape to
// the detail routes. It is defined here (never in app/lib, which this surface
// must not touch) so the presentational components typecheck standalone.
// Because TypeScript is structural, a provider-exported `EntityDetail` of the
// same shape is fully assignable to these props.
import type { GameplayEntity, KnowledgeEntity } from '@/app/lib/game-hub/types';

export interface EntityDetail {
  game: KnowledgeEntity;
  gameSlug: string;
  entity: GameplayEntity;
  related: Array<{ label: string; entity: GameplayEntity }>;
}
