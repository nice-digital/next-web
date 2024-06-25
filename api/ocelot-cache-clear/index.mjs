/* global fetch */

export const handler = async (event) => {

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    scope: process.env.scope
  });
  
  const tokenResponse = await fetch(process.env.token_url, {
      method: "POST",
      headers: {
          'Content-Type': "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
  
  if (tokenResponse.status == 200) {
    
    let tokenResponseBody = await tokenResponse.json();
    
    const dataResponse = await fetch(process.env.cache_clear_url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenResponseBody.access_token}`
        }
      });
    
    const response = {
      statusCode: 200,
      body: 'Cache cleared successfully'
    }
    
    return response;
  } else {
      
    const response = {
      statusCode: 500,
      body: 'Error getting access token'
    }
    
    return response;
  }
  
};
