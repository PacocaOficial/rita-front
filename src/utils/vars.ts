export const LIMIT_TEXT_POST: number = Number(import.meta.env.VITE_LIMIT_TEXT_POST_URL) || 500;
export const LIMIT_TEXT_COMMENT: number = Number(import.meta.env.VITE_LIMIT_TEXT_COMMENT_URL) || LIMIT_TEXT_POST;
export const LIMIT_TEXT_REPORT: number = Number(import.meta.env.VITE_LIMIT_TEXT_REPORT_URL) || LIMIT_TEXT_POST;
export const LIMIT_NAME_COMMUNITY: number = Number(import.meta.env.VITE_LIMIT_NAME_COMMUNITY) || 100;
export const LIMIT_DESCRIPTION_COMMUNITY: number = Number(import.meta.env.VITE_LIMIT_DESCRIPTION_COMMUNITY) || 200;
export const MAX_BAN_DAYS: number = Number(import.meta.env.VITE_MAX_BAN_DAYS) || 100;

export const LIMIT_REQUEST_COMMENTS: number = Number(import.meta.env.VITE_LIMIT_TEXT_REPORT_URL) || 10;

export const PACOCA_API_URL = import.meta.env.VITE_PACOCA_API_URL ?? "http://127.0.0.1:8081/api";
export const API_URL = import.meta.env.VITE_BACKEND_API_URL ?? "http://127.0.0.1:8085/api";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:8081";
export const READBOOK_URL = import.meta.env.VITE_READBOOK_URL ?? "http://127.0.0.1:8000";
export const CRONOS_URL = import.meta.env.VITE_CRONOS_URL ?? "https://cronos.pacoca.site/";
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ?? "http://127.0.0.1:3000";
export const PACOCA_AI_URL = import.meta.env.VITE_PACOCA_AI_URL ?? "http://localhost:8082";