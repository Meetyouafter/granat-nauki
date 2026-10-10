const Api = {
  async GET<T>({ url }: { url: string }): Promise<T> {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error('API_URL is not set');
    }

    const res = await fetch(`${apiUrl}${url}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${url}`);
    }

    const body = (await res.json()) as { data: T };
    return body.data;
  },
};

export default Api;
