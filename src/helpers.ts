
export const Reply = {
    json: (data: any, status: number = 200, headers: any = {}) => {
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            status: status,
        });
    }
}