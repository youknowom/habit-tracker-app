// import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  "821971089270-jtarnjjj8ru9aqjpnadlbb9bnh20till.apps.googleusercontent.com";

export const useGoogleSignIn = () => {
  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId: WEB_CLIENT_ID,
  // });

  const signIn = async () => {
    console.log("Google Sign In not configured");
    // Temporarily disabled - requires expo-auth-session/providers/google
    // const result = await promptAsync();
    // if (result?.type === "success") {
    //   const idToken = result.params?.id_token;
    //   if (!idToken) return console.log("❌ Could not get ID token");
    //   const credential = GoogleAuthProvider.credential(idToken);
    //   return signInWithCredential(auth, credential);
    // } else {
    //   console.log("⚠️ Google login canceled or failed");
    // }
  };

  return { signIn, request: null, response: null };
};
