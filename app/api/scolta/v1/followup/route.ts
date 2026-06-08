import { createScoltaRouteHandlers } from "scolta-next";
import { getConfig } from "../../../../../lib/config";

export const POST = createScoltaRouteHandlers(getConfig()).followUp;
