

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idmqmyailtjzsrgtfjlo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkbXFteWFpbHRqenNyZ3RmamxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzAxNzksImV4cCI6MjAxNzUwNjE3OX0.VeGz_RXCUAkKLqcXV9mHY50mgU8zny1JNWjHrtsiUkM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
