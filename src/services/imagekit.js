import { supabase } from './supabaseClient';

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_ENDPOINT;
const authenticationEndpoint = import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_ENDPOINT;

if (!publicKey || !urlEndpoint) {
  console.error('ImageKit keys are missing! Check your .env file.');
}

export const imagekitConfig = {
  publicKey: publicKey || 'placeholder',
  urlEndpoint: urlEndpoint || 'https://ik.imagekit.io/placeholder',
};

/**
 * Authenticator function for imagekitio-react.
 * It fetches the JWT from Supabase to securely call our Edge Function.
 */
export const authenticator = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("User must be logged in to upload files.");
    }

    const response = await fetch(authenticationEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data; // returns { signature, expire, token }
  } catch (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
};

export const IMAGEKIT_FOLDER_PATH = '/scm-church';
