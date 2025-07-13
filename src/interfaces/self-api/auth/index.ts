import {
  AuthRequest,
  DiscoveryDocument,
  exchangeCodeAsync,
  fetchDiscoveryAsync,
  fetchUserInfoAsync,
  makeRedirectUri,
  refreshAsync,
  TokenResponse,
} from "expo-auth-session";
import constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

import {
  InvalidRequestError,
  NetworkError,
  OperationFailedError,
  ServiceUnavailableError,
} from "~/modules/_errors";

import {
  removeAuthorizationHeader,
  setAuthorizationHeader,
} from "~/interfaces/self-api/client";

// Endpoint
const oauthParams = {
  clientId:
    "967472276923-rntnvcjan1pt3tb8et39v8230nu4oqb7.apps.googleusercontent.com",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri({
    scheme: "com.fiap.anki",
  }),
};

const discoveryDocument = {
  issuer: "https://accounts.google.com",
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
} as DiscoveryDocument;

export const getAuthorizationCode = async () => {
  const request = new AuthRequest(oauthParams);
  const result = await request.promptAsync(discoveryDocument, {
    preferEphemeralSession: true,
  });

  if (!request.codeVerifier) {
    throw new InvalidRequestError("No codeVerifier available");
  }

  if (result.type !== "success" || !result.params?.code) {
    throw new OperationFailedError("Failed to get authorization code");
  }

  return {
    code: result.params?.code,
    codeVerifier: request.codeVerifier,
  };
};

export const getAuthTokens = async ({
  code,
  codeVerifier,
}: {
  code: string;
  codeVerifier: string;
}) => {
  try {
    const params = {
      ...oauthParams,
      extraParams: { code_verifier: codeVerifier },
      code,
    };

    const token = await exchangeCodeAsync(params, discoveryDocument);

    return token;
  } catch {
    throw new OperationFailedError("Failed to get token");
  }
};

export const login = async () => {
  try {
    const { code, codeVerifier } = await getAuthorizationCode();
    const tokens = await getAuthTokens({ code, codeVerifier });
    const user = await fetchUserInfoAsync(tokens, discoveryDocument);

    if (user.error) {
      throw user.error;
    }

    setAuthorizationHeader(tokens.accessToken);

    return { tokens, user };
  } catch (error: any) {
    if (error.response.status === 503) {
      throw new ServiceUnavailableError();
    }

    throw error;
  }
};

export const logout = async ({ token }: { token: string }) => {
  const redirectUri = makeRedirectUri({ scheme: constants.platform?.scheme });
  const startUrl = `${
    discoveryDocument.endSessionEndpoint
  }?access_token=${token}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  try {
    const { type } = await WebBrowser.openAuthSessionAsync(
      startUrl,
      redirectUri,
      {
        preferEphemeralSession: true,
      }
    );

    if (type === "success") {
      removeAuthorizationHeader();
      return true;
    }
  } catch {
    throw new NetworkError("Failed to logout");
  }
};

export const verifyToken = async (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const user = await fetchUserInfoAsync({ accessToken }, discoveryDocument);

  if (user.email) {
    setAuthorizationHeader(accessToken);
    return user;
  }

  removeAuthorizationHeader();
  return false;
};

export const refreshUserToken = async (tokens: TokenResponse) => {
  try {
    const freshTokens = await refreshAsync(
      { ...tokens, clientId: oauthParams.clientId },
      discoveryDocument
    );
    setAuthorizationHeader(freshTokens.accessToken);
    return freshTokens;
  } catch (error) {
    removeAuthorizationHeader();
    throw error;
  }
};
