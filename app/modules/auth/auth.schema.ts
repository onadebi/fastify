import { GenResponseSchema } from "../../utils/GenResponse";

export const RegisterSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" }
    }
  },
  response: {
    201: GenResponseSchema({
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" }
      }
    }),
    403: GenResponseSchema(null)
  }
};

export const LoginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" }
      }
    },
    403: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" }
      }
    },
  }
};


class AuthSchemas {
  static register = RegisterSchema;
  static LoginDto = LoginSchema;
}

export default AuthSchemas;
