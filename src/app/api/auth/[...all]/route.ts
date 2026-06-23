import { auth } from "@/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);
