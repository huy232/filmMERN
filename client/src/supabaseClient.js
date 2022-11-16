import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://fhiezswkgkcfdrdfrtmy.supabase.co"
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaWV6c3drZ2tjZmRyZGZydG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDk2MjgsImV4cCI6MTk4MzY4NTYyOH0.cabQJbcvk2RYLo10N4uIbC1TAzBhbGsm3Mtp8E3yXuI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
