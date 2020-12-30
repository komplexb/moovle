<template>
  <NuxtLink to="/">
    <img src="~/assets/images/moovle.png" alt="" class="Logo" />
  </NuxtLink>
</template>

<style>
.Logo {
  @apply h-24 w-24 xs:h-36 xs:w-36 md:h-48 md:w-48;

  animation: 1s appear;
  margin: auto;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
