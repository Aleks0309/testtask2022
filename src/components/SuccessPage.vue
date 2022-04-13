<template>
  <div class="if-success d-none" id="success">
    <h1>User successfully registered</h1>
    <img src="@/assets/svg/success-image.svg" alt="Success registration" class="mt-5">
  </div>
</template>

<script>
export default {
  name: "SuccessPage"
}
</script>

<style scoped>
  .if-success{
   margin: 140px auto;
}
</style>