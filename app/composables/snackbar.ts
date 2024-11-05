const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref()

export function useSnackbarStore() {
  function setSnackbarText(text: string, color?: string) {
    snackbarText.value = text
    showSnackbar.value = true
    snackbarColor.value = color
  }

  return {
    snackbarColor,
    showSnackbar,
    snackbarText,
    setSnackbarText,
  }
}
