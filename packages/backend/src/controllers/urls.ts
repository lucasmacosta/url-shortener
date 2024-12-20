import { Service } from "typedi";
import { RequestHandler } from "express";

import { UrlService } from "../services/urls";
import { UrlParamsDto, CreateUrlDto, UpdateUrlDto } from "common";
import { User } from "../models/User";

@Service()
export class UrlController {
  constructor(private urlService: UrlService) {}

  get: RequestHandler = async (req, res) => {
    const params = res.locals.validated.params as UrlParamsDto;

    const url = await this.urlService.get(params.slug);

    res.status(200).json(url);
  };

  getForUser: RequestHandler = async (req, res) => {
    const user = res.locals.user as User;

    const urls = await this.urlService.getForUser(user);

    res.status(200).json(urls);
  };

  create: RequestHandler = async (req, res) => {
    const body = res.locals.validated.body as CreateUrlDto;
    const user = res.locals.user as User | undefined;

    const url = await this.urlService.create(body, user);

    res.status(201).json(url);
  };

  update: RequestHandler = async (req, res) => {
    const params = res.locals.validated.params as UrlParamsDto;
    const body = res.locals.validated.body as UpdateUrlDto;
    const user = res.locals.user as User;

    const url = await this.urlService.update(params.slug, body, user);

    res.status(200).json(url);
  };

  redirect: RequestHandler = async (req, res) => {
    const params = res.locals.validated.params as UrlParamsDto;

    const url = await this.urlService.get(params.slug);

    res.redirect(301, url.url);
  };
}
