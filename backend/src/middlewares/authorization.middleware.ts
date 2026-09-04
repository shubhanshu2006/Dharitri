import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { userService } from "../services/user.service.js";
import {
  authorizationService,
  ResourceScope,
} from "../services/authorization.service.js";
import { UnauthorizedError } from "../utils/errors.js";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof userService.getUserWithPermissions>>;
    }
  }
}

export function loadUser() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = getAuth(req);

      if (auth.userId) {
        req.user = await userService.getUserWithPermissions(auth.userId);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  next();
}

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      authorizationService.requirePermission(req.user, permission);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAnyPermission(permissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      authorizationService.requireAnyPermission(req.user, permissions);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAllPermissions(permissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      authorizationService.requireAllPermissions(req.user, permissions);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      authorizationService.requireRole(req.user, role);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAnyRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      authorizationService.requireAnyRole(req.user, roles);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireResourceAccess(
  getResourceScope: (req: Request) => ResourceScope,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      const resourceScope = getResourceScope(req);
      authorizationService.requireResourceAccess(req.user, resourceScope);
      next();
    } catch (error) {
      next(error);
    }
  };
}
