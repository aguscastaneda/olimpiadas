import instance from './intance/instance'
import axios from 'axios'

class SocialService {

  static async googleProfile(token) {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    return response.data
  }

  static async googleLogin({ username, email }) {
    const response = await instance.post('/api/auth/google-login', {
      username,
      email
    }) 
    return response.data
  }
}

export default SocialService