export async function get(url: string, headers?: Record<string, string>): Promise<Response> {
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  return response;
}

export async function post(url: string, body: any, headers?: Record<string, string>): Promise<Response> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function put(url: string, body: any, headers?: Record<string, string>): Promise<Response> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function del(url: string, headers?: Record<string, string>): Promise<Response> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  return response;
}
