/** Server-only: every use case (Workspace core + functional collections) and its package files. */
import { USECASE_FILES } from "./content";
import { FUNCTION_USECASE_FILES } from "./content-functions";
import { USECASES } from "./data";
import { FUNCTION_USECASES, FUNCTIONS } from "./functions";
import type { UseCaseMeta } from "./types";

export const ALL_USECASES: UseCaseMeta[] = [...USECASES, ...FUNCTION_USECASES];
export const ALL_FILES = { ...USECASE_FILES, ...FUNCTION_USECASE_FILES };

/** Which function a use case belongs to, if any. */
export const FUNCTION_OF = new Map(FUNCTIONS.flatMap((f) => f.useCaseIds.map((id) => [id, f.id] as const)));
