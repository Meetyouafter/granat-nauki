class Api {
  static async GET<T>({ url }: { url: string }): Promise<T> {
    const res = await fetch(`${process.env.API_URL}${url}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${url}`);
    }

    const body: { data: T } = await res.json();
    return body.data;
  }
}

export default Api;