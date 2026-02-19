import axios from 'axios';

const SETU_BASE_URL = 'https://fiu.setu.co/v2';

const getHeaders = () => ({
    'x-client-id': process.env.SETU_CLIENT_ID,
    'x-client-secret': process.env.SETU_CLIENT_SECRET,
    'x-product-instance-id': process.env.SETU_PRODUCT_ID,
});

export const createConsent = async (mobileNumber: string) => {
    // Standardize VUA for sandbox if needed (usually phone@setu or phone@onemoney)
    const vua = mobileNumber.includes('@') ? mobileNumber : `${mobileNumber}@setu`;

    try {
        const payload = {
            vua: vua,
            consentMode: "STORE",
            fetchType: "PERIODIC",
            consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
            fiTypes: ["DEPOSIT"],
            purpose: {
                category: {
                    type: "string"
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
                from: "2023-01-01T00:00:00.000Z",
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
            redirectUrl: "http://localhost:3001/dashboard/accounts"
        };

        const response = await axios.post(`${SETU_BASE_URL}/consents`, payload, { headers: getHeaders() });
        return response.data;
    } catch (error: any) {
        // Log the full error to help debug
        console.error('Setu Consent Error Details:', JSON.stringify(error.response?.data, null, 2) || error.message);
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
