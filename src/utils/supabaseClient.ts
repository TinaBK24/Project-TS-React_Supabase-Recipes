import { createClient } from '@supabase/supabase-js'

// Отримуємо значення з змінних середовища
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Створюємо клієнт
export const supabase = createClient(supabaseUrl, supabaseKey)