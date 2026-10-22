/* REDROOM · CONTENIDO DEL SITIO
   Este archivo lo escribe el panel /admin. Puedes editarlo a mano, pero mantén el formato:
   window.RR_DATA = { ... };  (JSON válido entre las llaves) */
window.RR_DATA = {
 "version": 1,
 "sitio": {
  "nombre": "REDROOM",
  "tituloSEO": "REDROOM — Productora audiovisual | Talca · Maule · Valparaíso",
  "descripcionSEO": "Redroom es una productora audiovisual de cine, videoclips y video comercial en Talca, el Maule y Valparaíso. Entra a la sala.",
  "colores": {
   "fondo": "#050505",
   "gris1": "#141414",
   "gris2": "#2a2a2a",
   "gris3": "#8a8a8a",
   "texto": "#f2f2f2",
   "acento": "#e10600"
  },
  "fuentes": {
   "titulos": "Bebas Neue",
   "texto": "Inter"
  },
  "grano": true
 },
 "contacto": {
  "email": "CORREO@REDROOM.CL",
  "instagram": "https://instagram.com/",
  "youtube": "https://youtube.com/",
  "tiktok": "",
  "whatsapp": "",
  "formspree": ""
 },
 "menu": [
  {
   "texto": "DESCUBRIR",
   "pagina": "discover",
   "visible": true
  },
  {
   "texto": "TRABAJOS",
   "pagina": "work",
   "visible": true
  },
  {
   "texto": "COMERCIAL",
   "pagina": "commercial",
   "visible": true
  },
  {
   "texto": "ARTÍSTICO",
   "pagina": "artistic",
   "visible": true
  },
  {
   "texto": "SENSACIÓN",
   "pagina": "mood",
   "visible": true
  },
  {
   "texto": "ARMA TU PROYECTO",
   "pagina": "build",
   "visible": true
  },
  {
   "texto": "REDROOM MAULE",
   "pagina": "maule",
   "visible": true
  },
  {
   "texto": "NOSOTROS",
   "pagina": "about",
   "visible": true
  },
  {
   "texto": "COLABORA",
   "pagina": "collaborate",
   "visible": true
  },
  {
   "texto": "CONTACTO",
   "pagina": "contact",
   "visible": true
  }
 ],
 "botones": {
  "cotizar": "SOLICITAR COTIZACIÓN",
  "colaborar": "CREEMOS ALGO JUNTOS",
  "menu": "MENÚ",
  "cerrar": "CERRAR"
 },
 "experiencia": {
  "botonRojo": true,
  "intervalo": 2800,
  "visor": true
 },
 "paginas": {
  "index": {
   "titulo": "REDROOM",
   "cargando": "CARGANDO EXPERIENCIA",
   "listo": "LISTO",
   "boton": "ENTRAR A LA REDROOM"
  },
  "discover": {
   "tag": "DESCUBRIR",
   "titulo": "NO SOLO GRABAMOS HISTORIAS.\n*CONSTRUIMOS MUNDOS.*",
   "destacadosTag": "EXPLORA",
   "destacadosTitulo": "TRABAJOS DESTACADOS",
   "cantidadDestacados": 4,
   "verTodo": "VER TODO",
   "cierre": "PRIMERO SIÉNTELO. DESPUÉS LO CONSTRUIMOS.",
   "botonSensacion": "EXPLORAR POR SENSACIÓN",
   "botonProyecto": "EMPEZAR UN PROYECTO"
  },
  "work": {
   "tag": "PORTAFOLIO",
   "titulo": "TRABAJOS",
   "todos": "TODOS",
   "boton": "O EXPLORA POR SENSACIÓN"
  },
  "mood": {
   "tag": "BÚSQUEDA POR SENSACIÓN",
   "titulo": "¿QUÉ QUIERES SENTIR?",
   "vacio": "PRONTO PODRÁS EXPLORAR POR SENSACIÓN. MIENTRAS TANTO, ENTRA A TODOS LOS TRABAJOS."
  },
  "commercial": {
   "tag": "COMERCIAL",
   "titulo": "RESULTADOS QUE SE VEN COMO CINE",
   "intro": "",
   "servicios": [
    {
     "titulo": "EVENTOS",
     "texto": "Cobertura audiovisual pensada para recordar la emoción del día."
    },
    {
     "titulo": "MATRIMONIOS",
     "texto": "Una historia filmada con mirada cinematográfica."
    },
    {
     "titulo": "CORPORATIVO",
     "texto": "Videos que muestran a tu empresa con claridad y estilo."
    },
    {
     "titulo": "REDES SOCIALES",
     "texto": "Piezas cortas con identidad para redes."
    },
    {
     "titulo": "PUBLICIDAD",
     "texto": "Conceptos y piezas para campañas."
    },
    {
     "titulo": "CONTENIDO PARA MARCAS",
     "texto": "Contenido recurrente con una estética propia."
    }
   ]
  },
  "artistic": {
   "tag": "ARTÍSTICO",
   "titulo": "NUESTROS *MUNDOS*",
   "intro": "Proyectos propios y colaborativos.",
   "servicios": [
    {
     "titulo": "CORTOMETRAJES",
     "texto": "Cortometrajes de autor."
    },
    {
     "titulo": "VIDEOCLIPS",
     "texto": "Videoclips con identidad."
    },
    {
     "titulo": "SESIONES EN VIVO",
     "texto": "Conciertos en vivo registrados como cine."
    },
    {
     "titulo": "EXPERIMENTAL",
     "texto": "Exploración de imagen y sonido."
    },
    {
     "titulo": "DOCUMENTAL / OTROS",
     "texto": "Otras formas de contar."
    }
   ]
  },
  "build": {
   "tag": "ARMA TU PROYECTO",
   "pasos": [
    {
     "clave": "TIPO DE PROYECTO",
     "pregunta": "¿QUÉ ESTÁS CREANDO?",
     "tipo": "opciones",
     "opciones": [
      "VIDEO CORPORATIVO",
      "VIDEOCLIP",
      "EVENTO",
      "MATRIMONIO",
      "CORTOMETRAJE",
      "REDES SOCIALES",
      "SESIÓN EN VIVO",
      "OTRO"
     ]
    },
    {
     "clave": "SENSACIÓN",
     "pregunta": "¿QUÉ QUIERES QUE SIENTA LA GENTE?",
     "tipo": "opciones",
     "opciones": [
      "CINEMATOGRÁFICO",
      "EMOTIVO",
      "ENÉRGICO",
      "OSCURO",
      "CRUDO",
      "ELEGANTE",
      "EXPERIMENTAL"
     ]
    },
    {
     "clave": "LUGAR",
     "pregunta": "¿DÓNDE?",
     "tipo": "opciones",
     "opciones": [
      "TALCA",
      "MAULE",
      "VALPARAÍSO",
      "SANTIAGO",
      "OTRO"
     ]
    },
    {
     "clave": "IDEA",
     "pregunta": "CUÉNTANOS TU IDEA",
     "tipo": "texto",
     "opciones": []
    },
    {
     "clave": "CONTACTO",
     "pregunta": "DATOS DE CONTACTO",
     "tipo": "contacto",
     "opciones": []
    }
   ],
   "final": "TU PROYECTO\n*ESTÁ LISTO.*",
   "enviar": "ENVIAR PROYECTO",
   "editar": "EDITAR",
   "asunto": "Solicitud de cotización Redroom",
   "claqueta": true
  },
  "maule": {
   "tag": "REDROOM MAULE",
   "titulo": "LA RED *VIVA*",
   "intro": "Cada punto es una persona, banda, emprendimiento, locación o proyecto del Maule. Toca uno y mira con quién se conecta.",
   "boton": "CONSTRUIR LA RED",
   "botonVolver": "VOLVER A EXPLORAR",
   "nota": "DEMO: nodos de ejemplo. Cada proyecto realizado agrega una conexión nueva.",
   "ayuda": "Selecciona un punto para generar su constelación.",
   "final": "La red completa: así ha crecido Redroom en el Maule."
  },
  "about": {
   "tag": "NOSOTROS",
   "titulo": "REDROOM",
   "intro": "Redroom nace desde una búsqueda cinematográfica y audiovisual de dos cineastas de la Universidad de Valparaíso.",
   "equipo": [
    {
     "nombre": "ANÍBAL CASTILLO",
     "rol": "Cineasta",
     "bio": "",
     "foto": "",
     "etiqueta": "PLACEHOLDER"
    },
    {
     "nombre": "VÍCTOR QUEZADA",
     "rol": "Cineasta",
     "bio": "",
     "foto": "",
     "etiqueta": "PLACEHOLDER"
    }
   ]
  },
  "collaborate": {
   "tag": "COLABORA",
   "titulo": "CREEMOS *ALGO JUNTOS*",
   "intro": "MÚSICOS · ARTISTAS · CINEASTAS · ACTORES · DISEÑADORES · EMPRENDEDORES · MARCAS · PRODUCTORAS",
   "boton": "ENVIAR",
   "asunto": "Colaboración Redroom",
   "campos": [
    {
     "etiqueta": "Nombre",
     "largo": false
    },
    {
     "etiqueta": "Tipo de proyecto",
     "largo": false
    },
    {
     "etiqueta": "Instagram / redes",
     "largo": false
    },
    {
     "etiqueta": "Descripción",
     "largo": true
    },
    {
     "etiqueta": "Qué buscas realizar",
     "largo": true
    }
   ]
  },
  "contact": {
   "tag": "CONTACTO",
   "titulo": "REDROOM",
   "boton": "EMPEZAR UN PROYECTO",
   "cierre": "NOS VEMOS EN LA SALA.",
   "asunto": "Contacto Redroom",
   "campos": [
    {
     "etiqueta": "Nombre",
     "largo": false
    },
    {
     "etiqueta": "Correo",
     "largo": false,
     "correo": true
    },
    {
     "etiqueta": "Mensaje",
     "largo": true
    }
   ]
  },
  "project": {
   "director": "MODO DIRECTOR",
   "ficha": "FICHA TÉCNICA",
   "verYoutube": "VER EN YOUTUBE",
   "volver": "VOLVER A TRABAJOS"
  }
 },
 "sensaciones": [
  "oscuro",
  "cinematográfico",
  "crudo",
  "enérgico",
  "emotivo",
  "abstracto",
  "elegante",
  "caótico"
 ],
 "modoDirector": [
  {
   "nombre": "ENCUADRE",
   "descripcion": "Composición y encuadre",
   "palabras": [
    "dirección de fotografía",
    "dirección audiovisual",
    "dirección,",
    "dirección y",
    "idea original"
   ]
  },
  {
   "nombre": "CÁMARA",
   "descripcion": "Cámara y lentes",
   "palabras": [
    "videografía",
    "cámara",
    "fotografía",
    "grabado"
   ]
  },
  {
   "nombre": "LUZ",
   "descripcion": "Diseño de luz",
   "palabras": [
    "ilumina",
    "lumínica"
   ]
  },
  {
   "nombre": "COLOR",
   "descripcion": "Color y look",
   "palabras": [
    "post-producción",
    "postproducción"
   ]
  },
  {
   "nombre": "MONTAJE",
   "descripcion": "Montaje y ritmo",
   "palabras": [
    "montaje"
   ]
  },
  {
   "nombre": "DETRÁS DE CÁMARAS",
   "descripcion": "Detrás de cámaras",
   "palabras": [
    "realización",
    "producción audiovisual",
    "producción",
    "making of",
    "sonido",
    "registro",
    "mezcla",
    "dirección de arte",
    "colabora"
   ]
  }
 ],
 "proyectos": [
  {
   "visible": true,
   "featured": false,
   "id": "p01",
   "title": "Ciclo Árbolazul 2026 - Episodio 14: Nadar de Noche",
   "date": "2026-09-28",
   "dateText": "28 sept 2026",
   "link": "https://youtu.be/81hCwCxhXpc?si=SnBn7eCGRPbj-QAf",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de Nadar de Noche (Buenos Aires, Argentina), que comparte escenario con Estoy bien. Episodio 14 del Ciclo Árbolazul 2026.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "channel": "ArbolAzul ediciones",
   "venue": "Sala Master — Santiago de Chile",
   "recorded": "18/04/2026",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Víctor Quezada, Aníbal Castillo, Gustavo Abarca y Flavia López"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Gonzalo Valencia"
    ],
    [
     "Iluminación en vivo",
     "Nicoletta Fuentealba"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Fotografía de thumbnail",
     "Carlos Molina"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p02",
   "title": "Ciclo Árbolazul 2025 - Episodio 13: Tenemos Explosivos",
   "date": "2026-07-24",
   "dateText": "24 jul 2026",
   "link": "https://youtu.be/W7zxUeDb_go?si=cbq-6mkt5D7qQI__",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Concierto en vivo de Tenemos Explosivos, con Felicia Morales y Rodrigo Recabarren como músicos invitados, compartiendo escenario con la banda peruana Sueño Púrpura. Episodio 13 del Ciclo Árbolazul 2025.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Centro Arte Alameda, Sala Ceina — Santiago de Chile",
   "recorded": "27/11/2025",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Brenda Lizarzaburu)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Franki Valium"
    ],
    [
     "Registro multipista",
     "Gonzalo Valencia"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Fotografía",
     "Carlos Molina"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p03",
   "title": "Tenemos Explosivos - San Borja / en vivo @ Ciclo Árbolazul 2025",
   "date": "2026-07-24",
   "dateText": "24 jul 2026",
   "link": "https://youtu.be/w5KhruR7fL8?si=XtKr_B_Rq_N5ECBz",
   "category": "EN VIVO",
   "mood": [],
   "description": "Tenemos Explosivos interpreta «San Borja» en vivo, en la fecha que compartieron con Sueño Púrpura dentro del Ciclo Árbolazul 2025.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Centro Arte Alameda, Sala Ceina — Santiago de Chile",
   "recorded": "27/11/2025",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Brenda Lizarzaburu)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Franki Valium"
    ],
    [
     "Registro multipista",
     "Gonzalo Valencia"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Fotografía",
     "Carlos Molina"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p04",
   "title": "Siniestra Pandora - Pagano (Videoclip Oficial)",
   "date": "2026-07-09",
   "dateText": "9 jul 2026",
   "link": "https://youtu.be/rzHGjHmYCMI?si=M79tKt7TSDySZ-gv",
   "category": "VIDEOCLIP",
   "mood": [],
   "description": "Videoclip oficial de «Pagano», de la banda Siniestra Pandora, realizado por Redroom. Lanzado en 2026 por Sello Leviatán y Hotel Records.",
   "client": "Siniestra Pandora · Sello Leviatán y Hotel Records",
   "duration": "",
   "director": {},
   "credits": [
    [
     "Dirección, guion y producción",
     "Aníbal Castillo Lillo"
    ],
    [
     "Idea original, dirección de fotografía y montaje",
     "Víctor Quezada Carrasco"
    ],
    [
     "Dirección de arte",
     "Vanessa Quezada"
    ],
    [
     "Asistencia de fotografía y fotografía fija",
     "Constanza Ramírez"
    ],
    [
     "Asistencia de producción",
     "Gustavo Abarca"
    ],
    [
     "Making of",
     "Nicolás Guerra"
    ],
    [
     "Elenco",
     "Agustín Escobar, Vanessa Quezada, Isidora Ramírez, Belén Chavarriga y Fabianne Ramona"
    ],
    [
     "Siniestra Pandora",
     "Tristan, Tito, Milo, Vicho y Lukas"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p05",
   "title": "Ciclo Árbolazul 2025 - Episodio 12: Sueño Púrpura",
   "date": "2026-04-01",
   "dateText": "1 abr 2026",
   "link": "https://youtu.be/cN3vjmN6rfE?si=brjbrbKQDtBa4xDP",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de la banda peruana Sueño Púrpura, que comparte escenario con Tenemos Explosivos. Episodio 12 del Ciclo Árbolazul 2025.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Centro Arte Alameda, Sala Ceina — Santiago de Chile",
   "recorded": "27/11/2025",
   "credits": [
    [
     "Sueño Púrpura",
     "Jandy Torres (voz), Rodolfo Ontaneda y Christian Ortega (guitarras), José Andrés Lezma (bajo), Juan Camba (batería)"
    ],
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Brenda Lizarzaburu)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Franki Valium"
    ],
    [
     "Registro multipista",
     "Gonzalo Valencia"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Fotografía",
     "Carlos Molina"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p06",
   "title": "Ciclo Árbolazul 2024 - Episodio 11: Tomates Asesinos",
   "date": "2026-03-16",
   "dateText": "16 mar 2026",
   "link": "https://youtu.be/EwiKl_w9bkE?si=2Ty1TlbiiVOhYOWY",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Concierto en vivo de la banda argentina Tomates Asesinos, compartiendo escenario con Tortuganónima. Episodio 11 del Ciclo Árbolazul 2024.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "30/05/2024",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Juan Carlos Miranda"
    ],
    [
     "Iluminación en vivo",
     "Nicoletta Fuentealba"
    ],
    [
     "Mezcla y masterización",
     "Manu Ogando"
    ],
    [
     "Fotografía",
     "Carlos Molina"
    ],
    [
     "Colabora",
     "Sala Master y Radio U. de Chile"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p07",
   "title": "10 Años de La ciencia simple en GAM, 2024 (Full concert)",
   "date": "2025-09-04",
   "dateText": "4 sept 2025",
   "link": "https://youtu.be/NoOa3BWMgUI?si=o_1IoKrWYUqwE6G0",
   "category": "EN VIVO",
   "mood": [],
   "description": "Concierto completo de La ciencia simple en la Sala A1 del GAM, celebrando sus 10 años.",
   "client": "Árbolazul ediciones · La ciencia simple",
   "duration": "",
   "director": {},
   "channel": "La ciencia simple",
   "venue": "Sala A1, Centro Cultural GAM — Santiago de Chile",
   "recorded": "18/05/2024",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Rodrigo Arias"
    ],
    [
     "Registro multipista",
     "Equipo GAM"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Fotografía",
     "Carlos Molina"
    ],
    [
     "Monitores",
     "Jorge Silva"
    ],
    [
     "Instalación lumínica",
     "Mauricio Lacrampette"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p08",
   "title": "Ciclo Árbolazul 2024 - Episodio 10: tortuganónima",
   "date": "2025-04-14",
   "dateText": "14 abr 2025",
   "link": "https://youtu.be/7KfsqOWheBI?si=P0CYocgHMvdakmPA",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de la banda chilena Tortuganónima, compartiendo escenario con Tomates Asesinos. Episodio 10 del Ciclo Árbolazul 2024.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "30/05/2024",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Diego Luck"
    ],
    [
     "Registro multipista",
     "Juan Carlos Miranda"
    ],
    [
     "Iluminación en vivo",
     "RNZ.Luces"
    ],
    [
     "Mezcla y masterización",
     "Gabriel Molina"
    ],
    [
     "Fotografía",
     "Carlos Molina"
    ],
    [
     "Colabora",
     "Sala Master y Radio U. de Chile"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p09",
   "title": "Ciclo Árbolazul 2024 - Episodio 9: Tomates en Verano",
   "date": "2025-02-27",
   "dateText": "27 feb 2025",
   "link": "https://youtu.be/o5hBm1wJEjM?si=d0JzRsCDOYIRHSFf",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Presentación en vivo de Tomates en Verano (Mar del Plata, Argentina), compartiendo escenario con Niños del Cerro. Episodio 9 del Ciclo Árbolazul 2024.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "30/05/2024",
   "credits": [
    [
     "Tomates en Verano",
     "Carina Monjeau, Ignacio Giobellina y Pedro Moscuzza"
    ],
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Juan Carlos Miranda"
    ],
    [
     "Iluminación en vivo",
     "Nicoletta Fuentealba"
    ],
    [
     "Mezcla y masterización",
     "Manuel Collado"
    ],
    [
     "Colabora",
     "Sala Master y Radio U. de Chile"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p10",
   "title": "Ciclo Árbolazul 2024 - Episodio 8: Niños del Cerro",
   "date": "2024-08-15",
   "dateText": "15 ago 2024",
   "link": "https://youtu.be/P_SJ6u9uqds?si=0x58BVWNH0muGrly",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de Niños del Cerro, compartiendo escenario con Tomates en Verano. Episodio 8 del Ciclo Árbolazul 2024.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "30/05/2024",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Williams Martínez"
    ],
    [
     "Registro multipista",
     "Juan Carlos Miranda"
    ],
    [
     "Iluminación en vivo",
     "Nicoletta Fuentealba"
    ],
    [
     "Mezcla y masterización",
     "Williams Martínez (Babel estudio)"
    ],
    [
     "Colabora",
     "Sala Master y Radio U. de Chile"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p11",
   "title": "Ciclo Árbolazul #1 Episodio 7: Protistas",
   "date": "2024-01-25",
   "dateText": "25 ene 2024",
   "link": "https://youtu.be/jabcf6Kr60w?si=VGJ5IuZOg0PHcJkR",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Concierto en vivo de Protistas, compartiendo escenario con el solista chileno Simón Campusano. Episodio 7 del Ciclo Árbolazul #1.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "09/06/2023",
   "credits": [
    [
     "Protistas",
     "Álvaro Solar, Alejandro Palacios, Cristóbal Ortiz y Simón Roa"
    ],
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Emerson Lastra"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Colabora",
     "Perdidos en el espacio"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p12",
   "title": "Ciclo Árbolazul #1 Episodio 5: El cómodo silencio de los que hablan poco",
   "date": "2023-10-26",
   "dateText": "26 oct 2023",
   "link": "https://youtu.be/O-tr-JVfR1w?si=Rms0esgIOYI5OwUh",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de El cómodo silencio de los que hablan poco, compartiendo escenario con la banda argentina 57000. Episodio 5 del Ciclo Árbolazul #1.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "12/05/2023",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Emerson Lastra"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Franco Perucca"
    ],
    [
     "Colabora",
     "Perdidos en el espacio"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p13",
   "title": "Ciclo Árbolazul #1 Episodio 4: Spiral Vortex",
   "date": "2023-10-10",
   "dateText": "10 oct 2023",
   "link": "https://youtu.be/kJHEgeyAh8c?si=wpjSFLk7HLSsKbaA",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Presentación en vivo de Spiral Vortex, compartiendo escenario con la banda argentina Los Negros. Episodio 4 del Ciclo Árbolazul #1.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "14/04/2023",
   "credits": [
    [
     "Spiral Vortex",
     "Sebastián Aylwin, Maximiliano Aylwin, Ismael Miranda y Nicolás Moyano"
    ],
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Emerson Lastra"
    ],
    [
     "Iluminación en vivo",
     "Juan León"
    ],
    [
     "Mezcla y masterización",
     "Manuel Collado"
    ],
    [
     "Colabora",
     "Perdidos en el espacio"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p14",
   "title": "Ciclo Árbolazul #1 Episodio 3: Los Negros",
   "date": "2023-08-27",
   "dateText": "27 ago 2023",
   "link": "https://youtu.be/kIVgwmy3AK8?si=luyi6jtIjntMkoxn",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de la banda argentina Los Negros, compartiendo escenario con Spiral Vortex. Episodio 3 del Ciclo Árbolazul #1.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "14/04/2023",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Emerson Lastra"
    ],
    [
     "Iluminación en vivo",
     "Juan León"
    ],
    [
     "Mezcla y masterización",
     "Manuel Collado"
    ],
    [
     "Colabora",
     "Perdidos en el espacio"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p15",
   "title": "Ciclo Árbolazul #1 Episodio 2: La ciencia simple",
   "date": "2023-08-03",
   "dateText": "3 ago 2023",
   "link": "https://youtu.be/ytMOioy9-pQ?si=3hik8EbLqCpEBQfJ",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Presentación en vivo de La ciencia simple, compartiendo escenario con Fin del Mundo. Episodio 2 del Ciclo Árbolazul #1.",
   "client": "Árbolazul ediciones",
   "duration": "",
   "director": {},
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "10/03/2023",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Roberto Marti"
    ],
    [
     "Registro multipista",
     "Emerson Lastra"
    ],
    [
     "Iluminación en vivo",
     "Bárbara Salas"
    ],
    [
     "Mezcla y masterización",
     "Manuel Collado"
    ],
    [
     "Colabora",
     "Perdidos en el espacio"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p16",
   "title": "Ciclo Árbolazul #1 Episodio 1: Fin del mundo",
   "date": "2023-07-03",
   "dateText": "3 jul 2023",
   "link": "https://youtu.be/h1ZSxzWxydY?si=sYpIXDgErNe7PdLx",
   "category": "CICLO ÁRBOLAZUL",
   "mood": [],
   "description": "Registro en vivo de Fin del Mundo (Buenos Aires, Argentina), compartiendo escenario con La ciencia simple. Episodio 1 del Ciclo Árbolazul #1.",
   "client": "Árbolazul ediciones",
   "duration": "15:21",
   "director": {},
   "channel": "ArbolAzul ediciones",
   "venue": "Sala Master, Radio U. de Chile — Santiago de Chile",
   "recorded": "10/03/2023",
   "credits": [
    [
     "Producción",
     "Árbolazul ediciones"
    ],
    [
     "Realización audiovisual",
     "RedRoom"
    ],
    [
     "Videografía",
     "Aníbal Castillo y Víctor Quezada"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Sonido en vivo",
     "Juan Carlos Miranda"
    ],
    [
     "Registro multipista",
     "Emerson Lastra"
    ],
    [
     "Iluminación en vivo",
     "Juan León"
    ],
    [
     "Mezcla y masterización",
     "Nicolás Aimo"
    ],
    [
     "Colabora",
     "Perdidos en el espacio"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p17",
   "title": "TRANSIENTE l La ciencia simple (Film completo 2021)",
   "date": "2021-04-28",
   "dateText": "28 abr 2021",
   "link": "https://youtu.be/olYUH4Vomg8?si=2v4fDdaqZzZiQyU8",
   "category": "CINE",
   "mood": [],
   "description": "Sesión filmada en una casona abandonada del barrio Yungay: La ciencia simple interpreta en vivo tres composiciones inéditas, con Andrés Quezada en percusión.",
   "client": "La ciencia simple",
   "duration": "",
   "director": {},
   "channel": "La ciencia simple",
   "venue": "Casona abandonada, barrio Yungay — Santiago de Chile",
   "credits": [
    [
     "Producción audiovisual",
     "REDROOM"
    ],
    [
     "Dirección audiovisual",
     "Víctor Quezada y Aníbal Castillo"
    ],
    [
     "Cámaras",
     "Víctor Quezada y Aníbal Castillo"
    ],
    [
     "Asistente de cámaras",
     "Andrea Gómez"
    ],
    [
     "Montaje y post-producción de imagen",
     "Víctor Quezada"
    ],
    [
     "Iluminación",
     "Bárbara Salas"
    ],
    [
     "Gráficas",
     "55:12"
    ],
    [
     "Registro de audio en vivo",
     "Jorge Silva y Danilo Pérez"
    ],
    [
     "Mezcla de audio",
     "Jorge Silva"
    ],
    [
     "Producción general",
     "La ciencia simple y Domingo Paredes"
    ],
    [
     "Producción ejecutiva",
     "Rienzi Valencia"
    ],
    [
     "Dirección general",
     "Gonzalo Valencia"
    ],
    [
     "La ciencia simple",
     "Edgar Sandoval, Rienzi Valencia, Tomás Cornejo y Gonzalo Valencia"
    ],
    [
     "Música invitada (percusión)",
     "Andrés Quezada"
    ],
    [
     "Apoyo",
     "LeRockPsicophonique"
    ]
   ]
  },
  {
   "visible": true,
   "featured": false,
   "id": "p18",
   "title": "La ciencia simple – Noisetalgia",
   "date": "2020-01-01",
   "dateText": "1 ene 2020",
   "link": "https://youtu.be/j-sFFPVfYuY?si=IZ09hiPdF5WaBNek",
   "category": "EN VIVO",
   "mood": [],
   "description": "Registro en vivo de «Noisetalgia», tema del disco «III V VII» de La ciencia simple, en su concierto de 2019 en el Parque Cultural de Valparaíso.",
   "client": "La ciencia simple · LeRockPsicophonique, Chancho Discos y Dunk!Records",
   "duration": "",
   "director": {},
   "channel": "La ciencia simple",
   "venue": "Teatro Parque Cultural de Valparaíso (Ex Cárcel) — Valparaíso",
   "recorded": "15/03/2019",
   "credits": [
    [
     "Dirección y post-producción",
     "Víctor Quezada Carrasco"
    ],
    [
     "Grabado por",
     "Víctor Quezada Carrasco y Aníbal Castillo Lillo"
    ],
    [
     "Iluminación en vivo",
     "Javier Hechenleitner"
    ],
    [
     "Stock footage",
     "John Mrubenstein; Beachfront B-Roll"
    ],
    [
     "La ciencia simple",
     "Edgar Sandoval, Tomás Cornejo, Gonzalo Valencia y Rienzi Valencia"
    ]
   ]
  }
 ],
 "mapa": {
  "tipos": [
   {
    "clave": "R",
    "nombre": "REDROOM"
   },
   {
    "clave": "B",
    "nombre": "BANDAS"
   },
   {
    "clave": "P",
    "nombre": "ARTISTAS Y PERSONAS"
   },
   {
    "clave": "E",
    "nombre": "EMPRENDIMIENTOS"
   },
   {
    "clave": "L",
    "nombre": "LOCACIONES"
   },
   {
    "clave": "J",
    "nombre": "PROYECTOS"
   },
   {
    "clave": "C",
    "nombre": "COLABORACIONES"
   }
  ],
  "nodos": [
   {
    "id": "rr",
    "t": "R",
    "n": "REDROOM",
    "ll": [
     -71.66,
     -35.43
    ],
    "add": "2020-01",
    "l": [
     "vc",
     "lo",
     "co",
     "su",
     "ct",
     "cm"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "ba",
    "t": "B",
    "n": "BANDA DEMO (TALCA)",
    "ll": [
     -71.7,
     -35.4
    ],
    "add": "2021-03",
    "l": [
     "vc"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "vc",
    "t": "J",
    "n": "VIDEOCLIP DEMO",
    "ll": [
     -71.62,
     -35.47
    ],
    "add": "2021-05",
    "l": [
     "ba",
     "rr"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "lo",
    "t": "L",
    "n": "LOCACIÓN DEMO (SAN JAVIER)",
    "ll": [
     -71.73,
     -35.6
    ],
    "add": "2021-05",
    "l": [
     "rr",
     "fo"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "fo",
    "t": "P",
    "n": "FOTÓGRAFO DEMO",
    "ll": [
     -71.24,
     -34.98
    ],
    "add": "2022-02",
    "l": [
     "lo",
     "ev"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "ev",
    "t": "C",
    "n": "EVENTO DEMO",
    "ll": [
     -71.45,
     -35.2
    ],
    "add": "2022-09",
    "l": [
     "fo",
     "em"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "em",
    "t": "E",
    "n": "EMPRENDIMIENTO DEMO (LINARES)",
    "ll": [
     -71.6,
     -35.85
    ],
    "add": "2022-09",
    "l": [
     "ev"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "ar",
    "t": "P",
    "n": "ARTISTA DEMO (CAUQUENES)",
    "ll": [
     -72.32,
     -35.97
    ],
    "add": "2023-01",
    "l": [
     "co",
     "cl"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "co",
    "t": "J",
    "n": "CORTOMETRAJE DEMO",
    "ll": [
     -72,
     -35.7
    ],
    "add": "2023-04",
    "l": [
     "rr",
     "ar"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "b2",
    "t": "B",
    "n": "BANDA DEMO (CONSTITUCIÓN)",
    "ll": [
     -72.42,
     -35.33
    ],
    "add": "2023-08",
    "l": [
     "su"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "su",
    "t": "J",
    "n": "SESIÓN EN VIVO DEMO",
    "ll": [
     -72.05,
     -35.25
    ],
    "add": "2023-08",
    "l": [
     "b2",
     "rr",
     "l2"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "l2",
    "t": "L",
    "n": "LOCACIÓN DEMO (CORDILLERA)",
    "ll": [
     -70.8,
     -35.45
    ],
    "add": "2024-02",
    "l": [
     "su"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "ma",
    "t": "E",
    "n": "MARCA DEMO (MOLINA)",
    "ll": [
     -71.28,
     -35.12
    ],
    "add": "2024-06",
    "l": [
     "ct"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "ct",
    "t": "J",
    "n": "VIDEO CORPORATIVO DEMO",
    "ll": [
     -71.5,
     -35.3
    ],
    "add": "2024-06",
    "l": [
     "rr",
     "ma"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "cl",
    "t": "C",
    "n": "COLABORACIÓN DEMO (PARRAL)",
    "ll": [
     -71.83,
     -36.14
    ],
    "add": "2025-01",
    "l": [
     "ar",
     "cm"
    ],
    "desc": "",
    "link": ""
   },
   {
    "id": "cm",
    "t": "J",
    "n": "PROYECTO NUEVO DEMO",
    "ll": [
     -71.9,
     -35.9
    ],
    "add": "2025-05",
    "l": [
     "rr",
     "cl"
    ],
    "desc": "",
    "link": ""
   }
  ],
  "contorno": [
   [
    -72.35,
    -34.95
   ],
   [
    -72.1,
    -34.72
   ],
   [
    -71.5,
    -34.66
   ],
   [
    -70.9,
    -34.7
   ],
   [
    -70.4,
    -34.9
   ],
   [
    -70.55,
    -35.3
   ],
   [
    -70.45,
    -35.7
   ],
   [
    -70.6,
    -36.05
   ],
   [
    -70.9,
    -36.35
   ],
   [
    -71.6,
    -36.45
   ],
   [
    -72.2,
    -36.38
   ],
   [
    -72.7,
    -36.05
   ],
   [
    -72.62,
    -35.75
   ],
   [
    -72.5,
    -35.35
   ]
  ]
 }
};
