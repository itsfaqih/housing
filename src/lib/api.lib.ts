import { BaseAPIResponseSchema } from "@/schemas/api.schema";
import {
  BadRequestError,
  BadResponseError,
  BaseResponseError,
  ConflictError,
  FetchError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/error.util";
import wretch from "wretch";
import env from "../../env";

export const api = wretch(env.NEXT_PUBLIC_APP_URL).resolve(async (r) => {
  return await r
    .notFound((err) => {
      const errJsonParsing = BaseAPIResponseSchema.safeParse(err.json);
      let errorMessage;

      if (errJsonParsing.success) {
        errorMessage = errJsonParsing.data.message;
      }

      throw new NotFoundError(errorMessage);
    })
    .fetchError((err) => {
      const errJsonParsing = BaseAPIResponseSchema.safeParse(err.json);
      let errorMessage;

      if (errJsonParsing.success) {
        errorMessage = errJsonParsing.data.message;
      }

      throw new FetchError(errorMessage);
    })
    .forbidden((err) => {
      const errJsonParsing = BaseAPIResponseSchema.safeParse(err.json);
      let errorMessage;

      if (errJsonParsing.success) {
        errorMessage = errJsonParsing.data.message;
      }

      throw new ForbiddenError(errorMessage);
    })
    .unauthorized((err) => {
      const errJsonParsing = BaseAPIResponseSchema.safeParse(err.json);
      let errorMessage;

      if (errJsonParsing.success) {
        errorMessage = errJsonParsing.data.message;
      }

      throw new UnauthorizedError(errorMessage);
    })
    .badRequest((err) => {
      const errJsonParsing = BaseAPIResponseSchema.safeParse(err.json);
      let errorMessage;

      if (errJsonParsing.success) {
        errorMessage = errJsonParsing.data.message;
      }

      throw new BadRequestError(errorMessage);
    })
    .internalError((err) => {
      const errJsonParsing = BaseAPIResponseSchema.safeParse(err.json);
      let errorMessage;

      if (errJsonParsing.success) {
        errorMessage = errJsonParsing.data.message;
      }

      throw new InternalServerError(errorMessage);
    })
    .error(409, () => {
      throw new ConflictError();
    })
    .json(async (json) => {
      return await BaseAPIResponseSchema.parseAsync(json).catch(() => {
        throw new BadResponseError();
      });
    })
    .catch((err) => {
      if (err instanceof BaseResponseError === false) {
        throw new BadResponseError();
      }
      throw err;
    });
});
