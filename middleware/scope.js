export default function ({ $auth, redirect }) {
  const { user } = $auth

  // use this scope to control which users can navigate to /favourites
  const inFavourites = user?.user?.scope?.includes('favourites')

  if (!inFavourites) redirect('/')
}
