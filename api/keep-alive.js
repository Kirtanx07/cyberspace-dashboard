import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 1. Verify Vercel Cron Secret (Security)
  // Vercel Crons send an Authorization header for security
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).send('Unauthorized');
  }

  // 2. Initialize Supabase Client
  // Supporting both Vite-style and Next-style env variables for compatibility
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase credentials missing in environment variables.' 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 3. Simple query to trigger activity in the database
    // This ensures Supabase sees traffic and won't auto-pause
    const { data, error } = await supabase.from('resources').select('id').limit(1);
    
    if (error) throw error;
    
    return res.status(200).json({ 
      success: true, 
      message: 'Supabase is awake.', 
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Keep-Alive Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to wake DB: ' + error.message 
    });
  }
}
