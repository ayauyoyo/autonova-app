function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var ${name}. Set it in your shell or in an .env file before starting Expo.`
    );
  }
  return value;
}

export const env = {
  supabaseUrl: requireEnv('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
};

