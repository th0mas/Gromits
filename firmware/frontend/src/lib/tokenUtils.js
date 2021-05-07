export const decodeToken = (rawToken) => {
  let base64Url = rawToken.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  
  let payload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(payload)

}

export const hasRole = (token, role) => decodeToken(token).auth.includes(role)

export const clientId = (token) => decodeToken(token).sub
