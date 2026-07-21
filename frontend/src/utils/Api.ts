class Api {
  static GET({ url }: { url: string }) {
    {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        cache: 'no-store'
      });
    }
  }
}

export default Api;