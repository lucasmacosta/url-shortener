import { get, post, put } from "./request";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface CreateUrlMappingParams {
  url: string;
  slug?: string;
}

export interface UpdateUrlMappingParams {
  slug: string;
}

export interface UrlMapping {
  id: number;
  url: string;
  slug: string;
}

export interface CreateUserParams {
  username: string;
}

export interface LoginUserParams {
  username: string;
}

export interface User {
  username: string;
}

export interface LoggedInUser {
  user: User;
  token: string;
}

function buildApiUrl(path: string) {
  return `${apiBaseUrl}/${path}`;
}

export async function createUrl(
  params: CreateUrlMappingParams,
  token?: string
) {
  return post<UrlMapping>(buildApiUrl("urls"), params, token);
}

export async function updateUrl(
  slug: string,
  params: UpdateUrlMappingParams,
  token?: string
) {
  return put<UrlMapping>(buildApiUrl(`urls/${slug}`), params, token);
}

export async function createUser(params: CreateUserParams) {
  return post<User>(buildApiUrl("users"), params);
}

export async function loginUser(params: LoginUserParams) {
  return post<LoggedInUser>(buildApiUrl("users/login"), params);
}

export async function getUrls(token: string) {
  return get<UrlMapping[]>(buildApiUrl("urls"), token);
}

export function buildShortUrl(urlMapping: UrlMapping) {
  return `${apiBaseUrl}/${urlMapping.slug}`;
}
