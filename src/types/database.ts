// Minimal database type definitions for Supabase client
export interface Database {
  public: {
    Tables: Record<string, unknown>;
    Functions: Record<string, unknown>;
  };
}
