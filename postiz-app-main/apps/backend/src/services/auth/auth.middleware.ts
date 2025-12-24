import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { User } from '@prisma/client';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
import { HttpForbiddenException } from '@gitroom/nestjs-libraries/services/exception.filter';
import { MastraService } from '@gitroom/nestjs-libraries/chat/mastra.service';

export const removeAuth = (res: Response) => {
  res.cookie('auth', '', {
    domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
    ...(!process.env.NOT_SECURED
      ? {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        }
      : {}),
    expires: new Date(0),
    maxAge: -1,
  });
  res.header('logout', 'true');
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private _organizationService: OrganizationService,
    private _userService: UsersService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // Mode "trusted internal" (InfluenceCore) :
    // - Permet d'utiliser le backend Postiz comme moteur de fonctionnalités sans exposer son UI login/register.
    // - InfluenceCore appelle les endpoints via son serveur (API proxy) en fournissant un header secret.
    const internalKeyHeader = req.headers['x-influencecore-internal-key'];
    const internalKeyEnv = process.env.INFLUENCECORE_INTERNAL_KEY;
    if (
      internalKeyEnv &&
      typeof internalKeyHeader === 'string' &&
      internalKeyHeader === internalKeyEnv
    ) {
      const userIdHeader = req.headers['x-influencecore-user-id'];
      const userEmailHeader = req.headers['x-influencecore-user-email'];

      const forcedUserId =
        typeof userIdHeader === 'string'
          ? userIdHeader
          : process.env.INFLUENCECORE_POSTIZ_USER_ID;
      const forcedUserEmail =
        typeof userEmailHeader === 'string'
          ? userEmailHeader
          : process.env.INFLUENCECORE_POSTIZ_USER_EMAIL;

      const user =
        forcedUserId
          ? await this._userService.getUserById(forcedUserId)
          : forcedUserEmail
            ? await this._userService.getUserByEmail(forcedUserEmail)
            : null;

      if (!user) {
        throw new HttpForbiddenException();
      }

      // On ne bloque pas sur activated ici : l'auth est déjà gérée côté InfluenceCore.
      // @ts-ignore
      delete user.password;

      const orgHeader =
        (req.cookies.showorg || req.headers.showorg) ??
        process.env.INFLUENCECORE_POSTIZ_ORG_ID;

      const organizations = (
        await this._organizationService.getOrgsByUserId(user.id)
      ).filter((f) => !f.users[0].disabled);

      const setOrg =
        organizations.find((org) => org.id === orgHeader) || organizations[0];

      if (!setOrg) {
        throw new HttpForbiddenException();
      }

      if (!setOrg.apiKey) {
        await this._organizationService.updateApiKey(setOrg.id);
      }

      (req as any).user = user;
      (req as any).org = setOrg;

      next();
      return;
    }

    const auth = req.headers.auth || req.cookies.auth;
    if (!auth) {
      throw new HttpForbiddenException();
    }
    try {
      let user = AuthService.verifyJWT(auth) as User | null;
      const orgHeader = req.cookies.showorg || req.headers.showorg;

      if (!user) {
        throw new HttpForbiddenException();
      }

      if (!user.activated) {
        throw new HttpForbiddenException();
      }

      const impersonate = req.cookies.impersonate || req.headers.impersonate;
      if (user?.isSuperAdmin && impersonate) {
        const loadImpersonate = await this._organizationService.getUserOrg(
          impersonate
        );

        if (loadImpersonate) {
          user = loadImpersonate.user;
          user.isSuperAdmin = true;
          delete user.password;

          (req as any).user = user;

          // @ts-ignore
          loadImpersonate.organization.users =
            loadImpersonate.organization.users.filter(
              (f) => f.userId === user.id
            );
          (req as any).org = loadImpersonate.organization;
          next();
          return;
        }
      }

      delete user.password;
      const organization = (
        await this._organizationService.getOrgsByUserId(user.id)
      ).filter((f) => !f.users[0].disabled);
      const setOrg =
        organization.find((org) => org.id === orgHeader) || organization[0];

      if (!organization) {
        throw new HttpForbiddenException();
      }

      if (!setOrg.apiKey) {
        await this._organizationService.updateApiKey(setOrg.id);
      }

      (req as any).user = user;
      (req as any).org = setOrg;
    } catch (err) {
      throw new HttpForbiddenException();
    }
    next();
  }
}
