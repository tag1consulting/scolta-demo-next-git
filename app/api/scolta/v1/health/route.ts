import { createScoltaRouteHandlers } from "scolta-next";
import { getConfig } from "../../../../../lib/config";

export const GET = createScoltaRouteHandlers(getConfig()).health;
