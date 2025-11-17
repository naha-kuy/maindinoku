const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tpkcideriipovmjluzbx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwa2NpZGVyaWlwb3Ztamx1emJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzY4NzUsImV4cCI6MjA3ODgxMjg3NX0.NWmNZihQN_0-FC4kp8e5kyKVubzNffatf1u58mR10F8';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
