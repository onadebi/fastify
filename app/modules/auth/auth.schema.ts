import { GenResponseSchema } from "../../utils/GenResponse";

export const RegisterSchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      confirmPassword: { type: "string" },
      userProfileImage: { type: "string", nullable: true },
      socialLogin: {
        type: "object",
        nullable: true,
        properties: {
          isSocialLogin: { 
            type: "boolean",
            default: false,
            description: "Indicates if this is a social login"
          },
          socialLoginAppName: { 
            type: "string",
            nullable: true,
            enum: [
              "onaxapp",
              "oauth_google", 
              "Clerk",
              "Twitter",
              "LinkedIn",
              "GitHub",
              "Microsoft",
              "YouTube"
            ],
            description: "Social login platform name"
          },
          oauth_identity: { 
            type: "string",
            nullable: true,
            description: "OAuth identity identifier"
          },
          app_id: { 
            type: "string",
            default: "",
            description: "Application ID from the social platform"
          },
          token: { 
            type: "string",
            nullable: true,
            description: "Social login token"
          }
        }
      }
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
  tags: ["Auth"],
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
