<script setup lang="ts">
const environment = import.meta.env.MODE
</script>

<template>
  <main class="page">
    <div class="card">
      <span class="badge">Brew Pilot</span>

      <h1>Site Brew Pilot</h1>

      <p>Ambiente de desenvolvimento funcionando 🚀</p>

      <small>
        Mode: {{ environment }}
      </small>
    </div>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #111827;
  font-family: Inter, system-ui, sans-serif;
}

.card {
  text-align: center;
  color: white;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid #374151;
  border-radius: 999px;
}

h1 {
  font-size: 48px;
  margin: 20px 0 10px;
}

p {
  color: #9ca3af;
  font-size: 18px;
}

small {
  color: #6b7280;
}
</style>