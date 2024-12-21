import axios from 'axios';

interface AuthRequest extends Express.Request {
    query: {
        code: string;
    };
    body: {
        [key: string]: string;
    };
}

interface AuthResponse extends Express.Response {
    json(data: any): unknown;
    redirect(url: string): void;
    status(code: number): this;
    send(body?: any): this;
}

interface TokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

// const refreshToken = async () => {
//     try {
//         const response = await axios.post(
//             'https://apps.fortnox.se/oauth-v1/token',
//             {
//                 grant_type: 'refresh_token',
//                 refresh_token: tokenData.refreshToken
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     'Authorization': `Basic ${encodedCredentials}`
//                 }
//             }
//         );

//         // UpdateTokenData(response.data);

//         console.log('Token refreshed successfully:', tokenData);
//     } catch (error) {
//         console.error('Error refreshing token:', error);
//         throw new Error('Unable to refresh token');
//     }
// };

const getTokenClient = async (req: AuthRequest, res: AuthResponse): Promise<void> => {
    console.log('Received body request:', req.body);
    try {
        const response = await axios.post(
            "https://apps.fortnox.se/oauth-v1/token",
            new URLSearchParams({
                grant_type: req.body.grant_type,
                code: req.body.code,
                redirect_uri: req.body.redirect_uri,
            }),       
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': req.body.authorization,
                    'client_id': req.body.client_id,
                    'client_secret': req.body.client_secret,
                }
            }
        );
        console.log('Response:', response.data);
        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            res.status(error.response?.status || 500).send(error.response?.data || "Error");
        } else {
            res.status(500).send("Error");
        }
    }
};

export { getTokenClient };