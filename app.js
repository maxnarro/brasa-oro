const { createApp, reactive, ref, computed, onMounted, onBeforeUnmount } = Vue;

createApp({
  setup() {
    /* ---------- estado general ---------- */
    const loading = ref(true);
    const scrolled = ref(false);
    const mobileMenuOpen = ref(false);
    const scrollProgress = ref(0);
    const showBackToTop = ref(false);
    const activeSection = ref('inicio');
    const year = new Date().getFullYear();

    const sections = [
      { id: 'inicio', label: 'Inicio' },
      { id: 'nosotros', label: 'Nosotros' },
      { id: 'menu', label: 'Menú' },
      { id: 'experiencia', label: 'Experiencia' },
      { id: 'galeria', label: 'Galería' },
      { id: 'testimonios', label: 'Opiniones' },
      { id: 'reservas', label: 'Reservas' },
      { id: 'contacto', label: 'Contacto' },
    ];

    function scrollTo(id) {
      mobileMenuOpen.value = false;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function handleScroll() {
      const y = window.scrollY || window.pageYOffset;
      scrolled.value = y > 40;
      showBackToTop.value = y > 700;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.value = docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0;

      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = s.id;
        }
      }
      activeSection.value = current;
    }

    /* ---------- hero: spotlight + brasas ---------- */
    const heroX = ref(50);
    const heroY = ref(50);
    function handleHeroMove(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      heroX.value = ((e.clientX - rect.left) / rect.width) * 100;
      heroY.value = ((e.clientY - rect.top) / rect.height) * 100;
    }

    const embers = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 120,
    }));

    /* ---------- stats con contador animado ---------- */
    const stats = reactive([
      { label: 'Años de Tradición', value: 25, suffix: '+', current: 0 },
      { label: 'Cortes Premium', value: 15, suffix: '', current: 0 },
      { label: 'Clientes Satisfechos', value: 38, suffix: 'k', current: 0 },
      { label: 'Premios Culinarios', value: 12, suffix: '', current: 0 },
    ]);
    let statsAnimated = false;

    function animateStats() {
      if (statsAnimated) return;
      statsAnimated = true;
      stats.forEach((s) => {
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          s.current = Math.round(s.value * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }

    /* ---------- menú ---------- */
    const menuCategories = ['Todos', 'Cortes Premium', 'Entradas', 'Guarniciones', 'Postres', 'Vinos y Bebidas'];
    const activeCategory = ref('Todos');

    const menuItems = [
      { id: 1, category: 'Cortes Premium', iconType: 'fuego', tag: 'Signature', name: 'Tomahawk 1kg', description: 'Costilla con hueso, madurada 30 días, a la parrilla de carbón de quebracho.', price: 68 },
      { id: 2, category: 'Cortes Premium', iconType: 'fuego', tag: '', name: 'Ribeye Black Angus', description: 'Corte 400g de marmoleo intenso, sellado a fuego alto y terminado lento.', price: 42 },
      { id: 3, category: 'Cortes Premium', iconType: 'fuego', tag: "Chef's Choice", name: 'T-Bone 500g', description: 'El equilibrio perfecto entre lomo y bife de chorizo en un solo corte.', price: 46 },
      { id: 4, category: 'Cortes Premium', iconType: 'fuego', tag: '', name: 'Picaña Brasileña', description: 'Corte 350g con cobertura de grasa dorada, asado en espada.', price: 34 },
      { id: 5, category: 'Cortes Premium', iconType: 'fuego', tag: 'Favorito', name: 'Filet Mignon', description: 'Medallón 300g de máxima terneza, envuelto en panceta ahumada.', price: 39 },
      { id: 6, category: 'Cortes Premium', iconType: 'fuego', tag: '', name: 'Vacío Argentino', description: 'Corte 400g de sabor intenso, cocción lenta sobre brasas.', price: 31 },
      { id: 7, category: 'Entradas', iconType: 'hoja', tag: '', name: 'Carpaccio de Res', description: 'Finas láminas de res, aceite de trufa, parmesano y rúcula.', price: 18 },
      { id: 8, category: 'Entradas', iconType: 'fuego', tag: 'Nuevo', name: 'Provoleta a la Parrilla', description: 'Queso provolone gratinado con orégano y aceite de oliva.', price: 14 },
      { id: 9, category: 'Entradas', iconType: 'hoja', tag: '', name: 'Empanadas de Carne', description: 'Tres unidades horneadas, relleno de corte premium y especias.', price: 12 },
      { id: 10, category: 'Guarniciones', iconType: 'hoja', tag: '', name: 'Papas Rústicas al Romero', description: 'Papas doradas con romero fresco, ajo confitado y sal de mar.', price: 10 },
      { id: 11, category: 'Guarniciones', iconType: 'hoja', tag: '', name: 'Puré de Camote', description: 'Camote asado con mantequilla especiada y un toque de canela.', price: 11 },
      { id: 12, category: 'Guarniciones', iconType: 'hoja', tag: '', name: 'Ensalada de Rúcula', description: 'Rúcula fresca, parmesano en láminas y reducción de balsámico.', price: 10 },
      { id: 13, category: 'Postres', iconType: 'postre', tag: '', name: 'Volcán de Chocolate', description: 'Bizcocho tibio de chocolate 70%, corazón líquido y helado de vainilla.', price: 13 },
      { id: 14, category: 'Postres', iconType: 'postre', tag: '', name: 'Flan Casero', description: 'Receta tradicional bañada en dulce de leche artesanal.', price: 10 },
      { id: 15, category: 'Vinos y Bebidas', iconType: 'copa', tag: '', name: 'Malbec Reserva', description: 'Copa de nuestra selección premium, notas a fruta madura y roble.', price: 15 },
      { id: 16, category: 'Vinos y Bebidas', iconType: 'copa', tag: 'Signature', name: 'Old Fashioned de Autor', description: 'Whisky añejo, bitter de naranja y un toque de humo de roble.', price: 17 },
    ];

    const filteredMenu = computed(() => {
      if (activeCategory.value === 'Todos') return menuItems;
      return menuItems.filter((m) => m.category === activeCategory.value);
    });

    /* ---------- experiencia ---------- */
    const features = [
      { emoji: '🔥', title: 'Parrilla a Leña', text: 'Cocción lenta sobre brasas de quebracho para un sabor ahumado inigualable.' },
      { emoji: '🍷', title: 'Maridaje de Autor', text: 'Sommelier en sala para acompañar cada corte con el vino perfecto.' },
      { emoji: '🔪', title: 'Cortes Selectos', text: 'Carne Black Angus y Wagyu, madurada en seco hasta 45 días.' },
      { emoji: '🕯️', title: 'Ambiente Íntimo', text: 'Un espacio de lujo bañado en tonos negros y dorados, ideal para toda ocasión.' },
    ];

    /* ---------- galería ---------- */
    const gallery = [
      { id: 1, size: 'lg', image: 'imagenes/img18.jpg', caption: 'Corte Signature a la Parrilla' },
      { id: 2, size: 'sm', image: 'imagenes/img5.jpg', caption: 'Brasas de Quebracho' },
      { id: 3, size: 'sm', image: 'imagenes/img4.jpg', caption: 'Selección de Vinos' },
      { id: 4, size: 'md', image: 'imagenes/img14.jpg', caption: 'Mesa Preparada' },
      { id: 5, size: 'md', image: 'imagenes/img16.jpg', caption: 'Nuestro Chef en Acción' },
      { id: 6, size: 'sm', image: 'imagenes/img15.jpg', caption: 'Ambiente de Salón' },
      { id: 7, size: 'md', image: 'imagenes/img6.jpg', caption: 'El Toque de Fuego Final' },
      { id: 8, size: 'sm', image: 'imagenes/img1.jpg', caption: 'Vacío a la Parrilla con Vegetales' },
      { id: 9, size: 'sm', image: 'imagenes/img3.jpg', caption: 'Término Perfecto, Jugo en Cada Corte' },
      { id: 10, size: 'md', image: 'imagenes/img10.jpg', caption: 'Bife de Chorizo con Papas Rústicas' },
      { id: 11, size: 'sm', image: 'imagenes/img11.jpg', caption: 'Parrilla de Autor' },
      { id: 12, size: 'sm', image: 'imagenes/img12.jpg', caption: 'Filet con Chips de Ajo' },
      { id: 13, size: 'md', image: 'imagenes/img13.jpg', caption: 'Chuleta a las Hierbas Finas' },
      { id: 14, size: 'sm', image: 'imagenes/img9.jpg', caption: 'T-Bone de la Casa' },
      { id: 15, size: 'sm', image: 'imagenes/img17.jpg', caption: 'Tabla Completa para Compartir' },
    ];
    const lightboxIndex = ref(null);
    function openLightbox(i) { lightboxIndex.value = i; }
    function closeLightbox() { lightboxIndex.value = null; }
    function nextImage() { lightboxIndex.value = (lightboxIndex.value + 1) % gallery.length; }
    function prevImage() { lightboxIndex.value = (lightboxIndex.value - 1 + gallery.length) % gallery.length; }

    /* ---------- testimonios ---------- */
    const testimonials = [
      { name: 'Marcos Villareal', role: 'Crítico Gastronómico', text: 'El Tomahawk de Fuego & Sal es sencillamente una obra de arte. El punto de cocción, perfecto; el servicio, impecable.', rating: 5 },
      { name: 'Elena Duarte', role: 'Cliente Frecuente', text: 'Celebramos nuestro aniversario aquí y la experiencia superó cualquier expectativa. El ambiente dorado y negro es simplemente elegante.', rating: 5 },
      { name: 'Rodrigo Fem', role: 'Sommelier Invitado', text: 'El maridaje que proponen realza cada corte. Rara vez encuentro una carta de vinos tan bien pensada para carnes rojas.', rating: 5 },
      { name: 'Isabela Cortés', role: 'Bloguera de Viajes', text: 'Un lugar que hay que visitar. La Picaña Brasileña y la Provoleta son imperdibles. Volveré sin dudarlo.', rating: 4 },
    ];
    const currentTestimonial = ref(0);
    let autoplayId = null;
    function nextTestimonial() { currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length; }
    function goToTestimonial(i) { currentTestimonial.value = i; }
    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(nextTestimonial, 5500);
    }
    function stopAutoplay() { if (autoplayId) clearInterval(autoplayId); }

    /* ---------- reservas ---------- */
    const todayISO = new Date().toISOString().split('T')[0];
    const horas = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
    const reservationForm = reactive({
      nombre: '', email: '', telefono: '', personas: 2, fecha: '', hora: '', ocasion: '', comentarios: '',
    });
    const errors = reactive({});
    const reservationSubmitted = ref(false);

    function validate() {
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!reservationForm.nombre) errors.nombre = 'Ingrese su nombre.';
      if (!reservationForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reservationForm.email)) errors.email = 'Ingrese un email válido.';
      if (!reservationForm.telefono || reservationForm.telefono.length < 7) errors.telefono = 'Ingrese un teléfono válido.';
      if (!reservationForm.fecha) errors.fecha = 'Seleccione una fecha.';
      if (!reservationForm.hora) errors.hora = 'Seleccione una hora.';
      return Object.keys(errors).length === 0;
    }

    function submitReservation() {
      if (!validate()) return;
      reservationSubmitted.value = true;
    }

    function resetReservation() {
      Object.assign(reservationForm, { nombre: '', email: '', telefono: '', personas: 2, fecha: '', hora: '', ocasion: '', comentarios: '' });
      reservationSubmitted.value = false;
    }

    /* ---------- lifecycle ---------- */
    let statsObserver;
    onMounted(() => {
      setTimeout(() => { loading.value = false; }, 1200);
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      startAutoplay();

      const statsEl = document.querySelector('.stats');
      if (statsEl) {
        statsObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) animateStats(); });
        }, { threshold: 0.3 });
        statsObserver.observe(statsEl);
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
      stopAutoplay();
      if (statsObserver) statsObserver.disconnect();
    });

    return {
      loading, scrolled, mobileMenuOpen, scrollProgress, showBackToTop, activeSection, year, sections, scrollTo,
      heroX, heroY, handleHeroMove, embers,
      stats,
      menuCategories, activeCategory, filteredMenu,
      features,
      gallery, lightboxIndex, openLightbox, closeLightbox, nextImage, prevImage,
      testimonials, currentTestimonial, goToTestimonial, startAutoplay, stopAutoplay,
      todayISO, horas, reservationForm, errors, reservationSubmitted, submitReservation, resetReservation,
    };
  },

  directives: {
    reveal: {
      mounted(el) {
        el.classList.add('reveal');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('is-visible');
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.15 });
        observer.observe(el);
      },
    },
  },
}).mount('#app');
