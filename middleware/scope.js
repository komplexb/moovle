export default function ({ $auth, redirect }) {
  // use this scope to control which users can navigate to /favourites
  const inFavourites = $auth.hasScope('favourites')

  if (!inFavourites) redirect('/')
}
