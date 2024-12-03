<template class="footer">

  <div class="cont">
    <div class="header-name">
      <RouterLink to="/">
        <h1>BuscaNet</h1>
      </RouterLink>
    </div>
    <div class="footer-container">
      <!-- Enlaces útiles -->
      <div class="footer-section">
        <h3>Enlaces útiles</h3>
        <ul>
          <li><a href="/privacidad">Política de privacidad</a></li>
          <li><a href="/terminos">Términos y condiciones</a></li>
          <li><a href="/faqs">FAQs</a></li>
          <li><a href="/soporte">Soporte técnico</a></li>
        </ul>
      </div>

      <!-- Redes sociales -->
      <div class="footer-section">
        <h3>Síguenos</h3>
        <div class="social-links">
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://twitter.com" target="_blank">Twitter</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
          <a href="https://instagram.com" target="_blank">Instagram</a>
        </div>
      </div>
      <div class="footer-section">
        <h3>Contacto</h3>
        <p>Email: <a href="mailto:support@ejemplo.com">support@ejemplo.com</a></p>
        <p>Teléfono: +123 456 7890</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 BuscaNet. Todos los derechos reservados.</p>
    </div>
  </div>

</template>

<style scoped>
.header-name a {
  text-decoration: none;
  color: white;
  margin: auto;
  text-align: center;
}

.cont {
  background-color: #2a2a2a;
  max-width: 100%;
  max-height: 100%;
  padding: 10px 0;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  color: white;
}

.footer-section {
  flex: 1;
  margin: 10px;
  text-align: center;
}

.footer-section h3 {
  margin-bottom: 15px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a,
.footer-section a {
  color: white;
  text-decoration: none;
}

.footer-section a:hover {
  text-decoration: underline;
}

.social-links a {
  margin-right: 10px;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  color: white;
}
</style>