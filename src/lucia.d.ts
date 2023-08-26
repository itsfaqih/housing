/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  type DatabaseUserAttributes = {
    avatar: string | null;
    full_name: string;
    email: string;
    type: "resident" | "housing_developer";
    verified_at: string | null;
  };
  type DatabaseSessionAttributes = {
    housing_developer_account?: {
      role: string | null;
      housing_developer_id: number;
    };
  };
}
