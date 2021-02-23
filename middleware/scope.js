export default function ({ $auth, redirect }) {
  const { user } = $auth

  const inFavourites = user?.user?.scope?.includes('favourites')

  if (!inFavourites) redirect('/')
}
