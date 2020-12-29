<template>
  <NuxtLink to="/">
    <img src="~/assets/images/moovle.png" alt="" class="Logo" />
  </NuxtLink>
</template>

<style>
.Logo {
  animation: 1s appear;
  margin: auto;
  width: 200px;
  height: 200px;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
