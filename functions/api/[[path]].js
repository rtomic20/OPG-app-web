const BACKEND = 'http://46.224.189.114/api'

export async function onRequest(context) {
  const { request, params } = context
  const path = params.path ? params.path.join('/') : ''
  const url = new URL(request.url)
  const target = `${BACKEND}/${path}${url.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')

  const init = {
    method: request.method,
    headers,
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = request.body
  }

  const response = await fetch(target, init)

  const resHeaders = new Headers(response.headers)
  resHeaders.set('Access-Control-Allow-Origin', '*')

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  })
}
