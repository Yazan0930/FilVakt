import axios from 'axios';

interface AuthRequest extends Express.Request {
    query: {
        code: string;
    };
    params: {
        endpoint: string;
    };
    body: {
        access_token: string; // The access token issued by Fortnox
    };
}

interface user {
    Me: {
        Name: string;
        Email: string;
        SysAdmin: boolean;
    }
}

interface AuthResponse extends Express.Response {
    json(data: any): unknown;
    redirect(url: string): void;
    status(code: number): this;
    send(body?: any): this;
}

export const getFortnoxResource = async (req: AuthRequest, res: AuthResponse): Promise<void> => {
    try {
        const { access_token } = req.body;
        const response = await axios.get(
            `https://api.fortnox.se/3/${req.params.endpoint}`,
            {
                headers: {
                    'Accept': 'application/json',     
                    'Authorization': `Bearer `+ access_token,
                },
            }
        );
        const data: user = response.data;
        console.log('Data:', data);
        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                error: "Fortnox API error",
                details: error.response?.data || error.message,
            });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};