export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, logout } = useAuthStore()
  if (to.name.startsWith('admin-') && !isAuthenticated.value) {
    logout()

}
})
