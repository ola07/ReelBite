import { Platform } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { supabase } from "./supabase";

const REDIRECT_URI = makeRedirectUri({
  scheme: "reelbite",
});

/** Sign in with Google using Supabase OAuth */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: REDIRECT_URI,
        skipBrowserRedirect: true,
      },
    });

    if (error) return { error: error.message };
    if (!data.url) return { error: "Failed to get Google sign-in URL" };

    // Open the OAuth URL in the browser
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      REDIRECT_URI
    );

    if (result.type === "success" && result.url) {
      // Extract the tokens from the URL fragment
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (sessionError) return { error: sessionError.message };
        return { error: null };
      }
    }

    return { error: "Google sign-in was cancelled" };
  } catch (e: any) {
    return { error: e.message || "Google sign-in failed" };
  }
}

/** Sign in with Apple using native Apple Authentication */
export async function signInWithApple(): Promise<{ error: string | null }> {
  try {
    if (Platform.OS !== "ios") {
      // On Android, use Supabase OAuth flow for Apple
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
        },
      });

      if (error) return { error: error.message };
      if (!data.url) return { error: "Failed to get Apple sign-in URL" };

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        REDIRECT_URI
      );

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const params = new URLSearchParams(url.hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });
          if (sessionError) return { error: sessionError.message };
          return { error: null };
        }
      }
      return { error: "Apple sign-in was cancelled" };
    }

    // Native Apple Sign In (iOS only)
    const rawNonce = Crypto.getRandomValues(new Uint8Array(16))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce
    );

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) {
      return { error: "No identity token from Apple" };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
      nonce: rawNonce,
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (e: any) {
    if (e.code === "ERR_REQUEST_CANCELED") {
      return { error: "Apple sign-in was cancelled" };
    }
    return { error: e.message || "Apple sign-in failed" };
  }
}
