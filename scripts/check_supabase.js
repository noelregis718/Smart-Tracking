const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    console.log('Checking Supabase connection and tables...');
    
    try {
        const { error: setuError } = await supabase
            .from('setu_connections')
            .select('*', { count: 'exact', head: true });

        if (setuError) {
            console.error('Error checking setu_connections table:', setuError.message);
            if (setuError.code === '42P01') {
                console.log('ALERT: setu_connections table does NOT exist!');
            }
        } else {
            console.log('setu_connections table exists.');
        }
    } catch (err) {
        console.error('Fatal error during check:', err);
    }
}

checkTables();
