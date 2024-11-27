import { jwtDecode } from 'jwt-decode'

export function useAuthStore() {
  const token = useCookie<string | undefined>('token')

  const router = useRouter()
  const user = computed(() => token.value ? jwtDecode(token.value) : undefined)
  const isAuthenticated = computed(() => {
    if (!user.value) {
      return false
    }
    return user.value.exp && user.value.exp > Math.floor(Date.now() / 1000)
  })
  const error = ref()
  function setToken(value: string) {
    token.value = value
  }

  function logout() {
    token.value = undefined
    router.push({ name: 'connexion' })
  }

  async function login(form: any) {
    try {
      const response = await $fetch<{ token?: string, error?: string }>('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        body: form,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.token) {
        token.value = response.token

        router.push({ name: 'home' })
      }
      else {
        error.value = response.error || 'Une erreur est survenue lors de la connexion'
      }
    }
    catch {
      error.value = 'Erreur lors de la connexion au serveur. Veuillez réessayer.'
    }
    console.log(token)
  }

  return {
    login,
    logout,
    token,
    setToken,
    user,
    error,
    isAuthenticated,
  }
}
