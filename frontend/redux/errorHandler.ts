import { AxiosError } from 'axios';

export default function handleError(error: unknown) {
    if (error instanceof AxiosError) {
        if (error.response) {
            console.error('API Error Response:', error.response);
            return error.response.data || error.message;
        } else if (error.request) {
            console.error('API Error Request:', error.request);
            return 'Network error or no response from server.';
        }
    }
    if (error instanceof Error) {
        console.error('API Error:', error.message);
        return error.message;
    }
    return 'An unknown error occurred.';
}
