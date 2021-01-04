<template>
  <NuxtLink to="/">
    <img src="~/assets/images/moovle.png" alt="" class="Logo" />
    <p class="slogan">search the marvel universe</p>
  </NuxtLink>
</template>

<style>
.Logo {
  @apply h-24 w-24 xs:h-36 xs:w-36 md:h-48 md:w-48;

  animation: 1s appear;
  margin: auto;
}

.slogan {
  @apply text-center italic font-semibold text-primary-alt;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
