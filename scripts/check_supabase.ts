import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    console.log('Checking Supabase connection and tables...');

    // Check expenses table
    const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*', { count: 'exact', head: true });

    if (expensesError) {
        console.error('Error checking expenses table:', expensesError.message);
    } else {
        console.log('expenses table exists.');
    }

    // Check setu_connections table
    const { data: setu, error: setuError } = await supabase
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
}

checkTables();
