import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

interface Usuario {
  idUsuario: number
  nombre: string
  correo: string
  rol: boolean
}

interface JwtPayload {
  nameid: string
  unique_name: string
  email: string
  role: string
  nbf: number
  exp: number
  iat: number
}

export const useLoginStore = defineStore({
  id: 'login',

  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null') as Usuario | null,
    error: null as string | null,
    token: localStorage.getItem('jwtToken') as string,
    email: localStorage.getItem('email') as string | null,
    codigo: localStorage.getItem('codigo') as string | null
  }),
  actions: {
    async login(correo: string, contrasena: string): Promise<boolean> {
      const login = { correo, contrasena }

      try {
        const response = await fetch(`/api/Usuario/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(login)
        })

        if (!response.ok) {
          throw new Error('Error al obtener la lista de usuarios.')
        }

        const data = await response.json()
        this.token = data.token
        localStorage.setItem('jwtToken', data.token)

        // Decodificar el token para obtener los detalles del usuario
        const decodedToken = jwtDecode<JwtPayload>(data.token)

        this.usuario = {
          idUsuario: parseInt(decodedToken.nameid),
          nombre: decodedToken.unique_name,
          correo: decodedToken.email,
          rol: decodedToken.role === 'Admin' // Ejemplo de manejo de rol
        }

        localStorage.setItem('usuario', JSON.stringify(this.usuario))
        console.log('Login exitoso')

        return true
      } catch (error: any) {
        this.error = error.message
        return false
      }
    },

    async register(nombre: string, correo: string, contrasena: string): Promise<boolean> {
      try {
        const nuevoUsuario = {
          nombre: nombre,
          contrasena: contrasena,
          correo: correo
        }

        const response = await fetch('/api/Usuario/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoUsuario)
        })

        if (!response.ok) {
          throw new Error('Error al registrar el usuario.')
        }

        const data = await response.json()
        this.token = data.token
        localStorage.setItem('jwtToken', data.token)

        // Decodificar el token para obtener los detalles del usuario
        const decodedToken = jwtDecode<JwtPayload>(data.token)

        this.usuario = {
          idUsuario: parseInt(decodedToken.nameid),
          nombre: decodedToken.unique_name,
          correo: decodedToken.email,
          rol: decodedToken.role === 'Admin' // Ejemplo de manejo de rol
        }

        localStorage.setItem('usuario', JSON.stringify(this.usuario))
        console.log('Login exitoso')

        return true
      } catch (error: any) {
        this.error = error.message
        return false
      }
    },
    async solicitarRecuperacion(email: string) {
      try {
        const obj = {
          correo: email
        }

        const response = await fetch('api/Usuario/solicitar-recuperacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMessage = errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : errorData.message || 'Error al reenviar el código.'
          throw new Error(errorMessage)
        }

        this.email = email
        localStorage.setItem('email', email)
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async VerificarCodigo(email: string, codigo: number) {
      try {
        const obj = {
          correo: email,
          codigo: codigo
        }

        const response = await fetch('api/Usuario/verficar-codigo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMessage = errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : errorData.message || 'Error al verificar el código.'
          throw new Error(errorMessage)
        }

        this.codigo = codigo.toString()
        localStorage.setItem('codigo', codigo.toString())
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async RestablecerContrasena(
      email: string,
      codigo: string,
      password1: string,
      password2: string
    ) {
      try {
        const obj = {
          correo: email,
          codigo: codigo,
          nuevaContrasena: password1,
          confirmarContrasena: password2
        }

        const response = await fetch('api/Usuario/restablecer-contrasena', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        })

        if (!response.ok) {
          const errorData = await response.json()
          const errorMessage = errorData.errors
            ? Object.values(errorData.errors).flat().join(', ')
            : errorData.message || 'Error desconocido al restablecer la contraseña.'
          throw new Error(errorMessage)
        }

        localStorage.removeItem('email')
        localStorage.removeItem('codigo')
        this.email = null
        this.codigo = null
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    logout() {
      this.usuario = null
      this.token = ''
      localStorage.removeItem('usuario')
      localStorage.removeItem('jwtToken')
      console.log('Sesión cerrada')
    }
  },
  getters: {
    isAuthenticated: (state) => state.usuario !== null,
    isAdmin: (state) => {
      return state.usuario?.rol === true
    },
    rol(state): boolean {
      return state.usuario?.rol || false
    }
  }
})
