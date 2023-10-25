export type ILoginPayload = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  success: boolean;
  data: {
    message: string;
    access_token: string;
    refresh_token: string;
  };
};
