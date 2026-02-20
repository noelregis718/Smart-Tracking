import axios from 'axios';

const SETU_BASE_URL = 'https://fiu-sandbox.setu.co/v2';

const getHeaders = () => {
    console.log('--- Setu Header Construction ---');
    console.log('SETU_CLIENT_ID present:', !!process.env.SETU_CLIENT_ID);
    console.log('SETU_CLIENT_SECRET present:', !!process.env.SETU_CLIENT_SECRET);
    console.log('SETU_PRODUCT_ID present:', !!process.env.SETU_PRODUCT_ID);

    const headers = {
        'x-client-id': process.env.SETU_CLIENT_ID,
        'x-client-secret': process.env.SETU_CLIENT_SECRET,
        'x-product-instance-id': process.env.SETU_PRODUCT_ID,
    };

    // SAFE LOGGING (only show first 4 characters)
    console.log('--- Credential Verification ---');
    console.log('Client ID:', process.env.SETU_CLIENT_ID?.substring(0, 4) + '...');
    console.log('Client Secret:', process.env.SETU_CLIENT_SECRET?.substring(0, 4) + '...');
    console.log('Product ID:', process.env.SETU_PRODUCT_ID?.substring(0, 4) + '...');

    return headers;
};

export const createConsent = async (mobileNumber: string) => {
    // For Setu Sandbox, 9999999999@onemoney is the most reliable VUA
    const vua = mobileNumber === '9999999999' ? '9999999999@onemoney' : (mobileNumber.includes('@') ? mobileNumber : `${mobileNumber}@setu`);

    try {
        const payload = {
            vua: vua,
            consentMode: "STORE",
            fetchType: "PERIODIC",
            consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
            fiTypes: ["DEPOSIT"],
            purpose: {
                category: {
                    type: "PERSONAL_FINANCE_MANAGEMENT"
                },
                code: "101",
                text: "Expense tracking for college project",
                refUri: "https://api.rebit.org.in/aa/purpose/101.xml"
            },
            consentDuration: {
                unit: "MONTH",
                value: 4
            },
            dataRange: {
                from: "2024-01-01T00:00:00.000Z",
                to: new Date().toISOString()
            },
            dataLife: {
                unit: "MONTH",
                value: 1
            },
            frequency: {
                unit: "MONTH",
                value: 1
            },
            context: [
                {
                    key: "accounttype",
                    value: "SAVINGS"
                }
            ],
            redirectUrl: "https://8643-2405-201-9002-d1c0-2cc4-1bb8-eae4-f553.ngrok-free.app/dashboard/accounts"
        };

        const url = `${SETU_BASE_URL}/consents`;
        console.log('Setu Call URL:', url);
        console.log('Setu Call Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post(url, payload, { headers: getHeaders() });
        return response.data;
    } catch (error: any) {
        // Log the full error to help debug
        if (error.response) {
            console.error('Setu Consent API Error:', {
                status: error.response.status,
                data: error.response.data
            });
        } else {
            console.error('Setu Consent Network/System Error:', error.message);
        }
        throw error;
    }
};

export const createDataSession = async (consentId: string) => {
    try {
        const response = await axios.post(`${SETU_BASE_URL}/sessions`, {
            consentId,
            format: 'json',
            dataRange: {
                from: "2023-01-01T00:00:00.000Z",
                to: new Date().toISOString()
            }
        }, { headers: getHeaders() });

        return response.data;
    } catch (error: any) {
        console.error('Error creating Setu data session:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchData = async (sessionId: string) => {
    try {
        const response = await axios.get(`${SETU_BASE_URL}/sessions/${sessionId}`, {
            headers: getHeaders()
        });

        return response.data;
    } catch (error: any) {
        console.error('Error fetching Setu data:', error.response?.data || error.message);
        throw error;
    }
};
