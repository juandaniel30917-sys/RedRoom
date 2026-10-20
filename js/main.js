/* REDROOM - sitio estatico. Todo el contenido editable esta en CONFIG y PROJECTS. */
var CONFIG = {
  email: "CORREO@REDROOM.CL",            // TODO: reemplazar por el correo real
  instagram: "https://instagram.com/",   // TODO: perfil real
  youtube: "https://youtube.com/",       // TODO: canal real
  // TODO: para enviar sin abrir el correo, cambia submitForm() por Formspree / Netlify Forms / FormSubmit
};
/* PORTAFOLIO REAL (fuente: documento de videos). Cada video:
   - title, dateText y link: tal cual vienen en el documento. date: la misma fecha en formato AAAA-MM-DD (para ordenar).
   - La portada y el reproductor salen solos del link de YouTube (ver ytId()). No hace falta subir imágenes.
   - category: tomada solo de lo que dice el título; "" = sin categoría (aparece solo en TODOS).
   - description, client, channel, venue (lugar), recorded (fecha de grabación) y credits ([rol, nombre]): sacados de la
     descripción de cada video en YouTube. duration: solo un video la mostraba; el resto queda "".
   - El Modo Director se arma solo con los créditos (cámara, luz, montaje...). Para escribir notas propias usa director,
     ej. {"LUZ":"Luz práctica de escenario."}. mood: por completar (ej. ["oscuro","enérgico"], palabras de MOODS).
   - featured:true en un video lo fija en TRABAJOS DESTACADOS (si ninguno lo tiene, se muestran los 4 más recientes).
   - Para agregar un video nuevo, copia una línea, cambia id/title/date/dateText/link y listo: el orden por fecha es automático. */
var PROJECTS = [
  {id:"p01",title:"Ciclo Árbolazul 2026 - Episodio 14: Nadar de Noche",date:"2026-09-28",dateText:"28 sept 2026",link:"https://youtu.be/81hCwCxhXpc?si=SnBn7eCGRPbj-QAf",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de Nadar de Noche (Buenos Aires, Argentina), que comparte escenario con Estoy bien. Episodio 14 del Ciclo Árbolazul 2026.",client:"Árbolazul ediciones",duration:"",director:{},channel:"ArbolAzul ediciones",venue:"Sala Master — Santiago de Chile",recorded:"18/04/2026",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Víctor Quezada, Aníbal Castillo, Gustavo Abarca y Flavia López"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Gonzalo Valencia"], ["Iluminación en vivo", "Nicoletta Fuentealba"], ["Mezcla y masterización", "Nicolás Aimo"], ["Fotografía de thumbnail", "Carlos Molina"]]},
  {id:"p02",title:"Ciclo Árbolazul 2025 - Episodio 13: Tenemos Explosivos",date:"2026-07-24",dateText:"24 jul 2026",link:"https://youtu.be/W7zxUeDb_go?si=cbq-6mkt5D7qQI__",category:"CICLO ÁRBOLAZUL",mood:[],description:"Concierto en vivo de Tenemos Explosivos, con Felicia Morales y Rodrigo Recabarren como músicos invitados, compartiendo escenario con la banda peruana Sueño Púrpura. Episodio 13 del Ciclo Árbolazul 2025.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Centro Arte Alameda, Sala Ceina — Santiago de Chile",recorded:"27/11/2025",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Brenda Lizarzaburu)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Franki Valium"], ["Registro multipista", "Gonzalo Valencia"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Nicolás Aimo"], ["Fotografía", "Carlos Molina"]]},
  {id:"p03",title:"Tenemos Explosivos - San Borja / en vivo @ Ciclo Árbolazul 2025",date:"2026-07-24",dateText:"24 jul 2026",link:"https://youtu.be/w5KhruR7fL8?si=XtKr_B_Rq_N5ECBz",category:"EN VIVO",mood:[],description:"Tenemos Explosivos interpreta «San Borja» en vivo, en la fecha que compartieron con Sueño Púrpura dentro del Ciclo Árbolazul 2025.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Centro Arte Alameda, Sala Ceina — Santiago de Chile",recorded:"27/11/2025",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Brenda Lizarzaburu)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Franki Valium"], ["Registro multipista", "Gonzalo Valencia"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Nicolás Aimo"], ["Fotografía", "Carlos Molina"]]},
  {id:"p04",title:"Siniestra Pandora - Pagano (Videoclip Oficial)",date:"2026-07-09",dateText:"9 jul 2026",link:"https://youtu.be/rzHGjHmYCMI?si=M79tKt7TSDySZ-gv",category:"VIDEOCLIP",mood:[],description:"Videoclip oficial de «Pagano», de la banda Siniestra Pandora, realizado por Redroom. Lanzado en 2026 por Sello Leviatán y Hotel Records.",client:"Siniestra Pandora · Sello Leviatán y Hotel Records",duration:"",director:{},credits:[["Dirección, guion y producción", "Aníbal Castillo Lillo"], ["Idea original, dirección de fotografía y montaje", "Víctor Quezada Carrasco"], ["Dirección de arte", "Vanessa Quezada"], ["Asistencia de fotografía y fotografía fija", "Constanza Ramírez"], ["Asistencia de producción", "Gustavo Abarca"], ["Making of", "Nicolás Guerra"], ["Elenco", "Agustín Escobar, Vanessa Quezada, Isidora Ramírez, Belén Chavarriga y Fabianne Ramona"], ["Siniestra Pandora", "Tristan, Tito, Milo, Vicho y Lukas"]]},
  {id:"p05",title:"Ciclo Árbolazul 2025 - Episodio 12: Sueño Púrpura",date:"2026-04-01",dateText:"1 abr 2026",link:"https://youtu.be/cN3vjmN6rfE?si=brjbrbKQDtBa4xDP",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de la banda peruana Sueño Púrpura, que comparte escenario con Tenemos Explosivos. Episodio 12 del Ciclo Árbolazul 2025.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Centro Arte Alameda, Sala Ceina — Santiago de Chile",recorded:"27/11/2025",credits:[["Sueño Púrpura", "Jandy Torres (voz), Rodolfo Ontaneda y Christian Ortega (guitarras), José Andrés Lezma (bajo), Juan Camba (batería)"], ["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Brenda Lizarzaburu)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Franki Valium"], ["Registro multipista", "Gonzalo Valencia"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Nicolás Aimo"], ["Fotografía", "Carlos Molina"]]},
  {id:"p06",title:"Ciclo Árbolazul 2024 - Episodio 11: Tomates Asesinos",date:"2026-03-16",dateText:"16 mar 2026",link:"https://youtu.be/EwiKl_w9bkE?si=2Ty1TlbiiVOhYOWY",category:"CICLO ÁRBOLAZUL",mood:[],description:"Concierto en vivo de la banda argentina Tomates Asesinos, compartiendo escenario con Tortuganónima. Episodio 11 del Ciclo Árbolazul 2024.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"30/05/2024",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Juan Carlos Miranda"], ["Iluminación en vivo", "Nicoletta Fuentealba"], ["Mezcla y masterización", "Manu Ogando"], ["Fotografía", "Carlos Molina"], ["Colabora", "Sala Master y Radio U. de Chile"]]},
  {id:"p07",title:"10 Años de La ciencia simple en GAM, 2024 (Full concert)",date:"2025-09-04",dateText:"4 sept 2025",link:"https://youtu.be/NoOa3BWMgUI?si=o_1IoKrWYUqwE6G0",category:"EN VIVO",mood:[],description:"Concierto completo de La ciencia simple en la Sala A1 del GAM, celebrando sus 10 años.",client:"Árbolazul ediciones · La ciencia simple",duration:"",director:{},channel:"La ciencia simple",venue:"Sala A1, Centro Cultural GAM — Santiago de Chile",recorded:"18/05/2024",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Rodrigo Arias"], ["Registro multipista", "Equipo GAM"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Nicolás Aimo"], ["Fotografía", "Carlos Molina"], ["Monitores", "Jorge Silva"], ["Instalación lumínica", "Mauricio Lacrampette"]]},
  {id:"p08",title:"Ciclo Árbolazul 2024 - Episodio 10: tortuganónima",date:"2025-04-14",dateText:"14 abr 2025",link:"https://youtu.be/7KfsqOWheBI?si=P0CYocgHMvdakmPA",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de la banda chilena Tortuganónima, compartiendo escenario con Tomates Asesinos. Episodio 10 del Ciclo Árbolazul 2024.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"30/05/2024",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Diego Luck"], ["Registro multipista", "Juan Carlos Miranda"], ["Iluminación en vivo", "RNZ.Luces"], ["Mezcla y masterización", "Gabriel Molina"], ["Fotografía", "Carlos Molina"], ["Colabora", "Sala Master y Radio U. de Chile"]]},
  {id:"p09",title:"Ciclo Árbolazul 2024 - Episodio 9: Tomates en Verano",date:"2025-02-27",dateText:"27 feb 2025",link:"https://youtu.be/o5hBm1wJEjM?si=d0JzRsCDOYIRHSFf",category:"CICLO ÁRBOLAZUL",mood:[],description:"Presentación en vivo de Tomates en Verano (Mar del Plata, Argentina), compartiendo escenario con Niños del Cerro. Episodio 9 del Ciclo Árbolazul 2024.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"30/05/2024",credits:[["Tomates en Verano", "Carina Monjeau, Ignacio Giobellina y Pedro Moscuzza"], ["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Juan Carlos Miranda"], ["Iluminación en vivo", "Nicoletta Fuentealba"], ["Mezcla y masterización", "Manuel Collado"], ["Colabora", "Sala Master y Radio U. de Chile"]]},
  {id:"p10",title:"Ciclo Árbolazul 2024 - Episodio 8: Niños del Cerro",date:"2024-08-15",dateText:"15 ago 2024",link:"https://youtu.be/P_SJ6u9uqds?si=0x58BVWNH0muGrly",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de Niños del Cerro, compartiendo escenario con Tomates en Verano. Episodio 8 del Ciclo Árbolazul 2024.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"30/05/2024",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada (apoyo: Gustavo Abarca y Alexander Reyes)"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Williams Martínez"], ["Registro multipista", "Juan Carlos Miranda"], ["Iluminación en vivo", "Nicoletta Fuentealba"], ["Mezcla y masterización", "Williams Martínez (Babel estudio)"], ["Colabora", "Sala Master y Radio U. de Chile"]]},
  {id:"p11",title:"Ciclo Árbolazul #1 Episodio 7: Protistas",date:"2024-01-25",dateText:"25 ene 2024",link:"https://youtu.be/jabcf6Kr60w?si=VGJ5IuZOg0PHcJkR",category:"CICLO ÁRBOLAZUL",mood:[],description:"Concierto en vivo de Protistas, compartiendo escenario con el solista chileno Simón Campusano. Episodio 7 del Ciclo Árbolazul #1.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"09/06/2023",credits:[["Protistas", "Álvaro Solar, Alejandro Palacios, Cristóbal Ortiz y Simón Roa"], ["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Emerson Lastra"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Nicolás Aimo"], ["Colabora", "Perdidos en el espacio"]]},
  {id:"p12",title:"Ciclo Árbolazul #1 Episodio 5: El cómodo silencio de los que hablan poco",date:"2023-10-26",dateText:"26 oct 2023",link:"https://youtu.be/O-tr-JVfR1w?si=Rms0esgIOYI5OwUh",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de El cómodo silencio de los que hablan poco, compartiendo escenario con la banda argentina 57000. Episodio 5 del Ciclo Árbolazul #1.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"12/05/2023",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Emerson Lastra"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Franco Perucca"], ["Colabora", "Perdidos en el espacio"]]},
  {id:"p13",title:"Ciclo Árbolazul #1 Episodio 4: Spiral Vortex",date:"2023-10-10",dateText:"10 oct 2023",link:"https://youtu.be/kJHEgeyAh8c?si=wpjSFLk7HLSsKbaA",category:"CICLO ÁRBOLAZUL",mood:[],description:"Presentación en vivo de Spiral Vortex, compartiendo escenario con la banda argentina Los Negros. Episodio 4 del Ciclo Árbolazul #1.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"14/04/2023",credits:[["Spiral Vortex", "Sebastián Aylwin, Maximiliano Aylwin, Ismael Miranda y Nicolás Moyano"], ["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Emerson Lastra"], ["Iluminación en vivo", "Juan León"], ["Mezcla y masterización", "Manuel Collado"], ["Colabora", "Perdidos en el espacio"]]},
  {id:"p14",title:"Ciclo Árbolazul #1 Episodio 3: Los Negros",date:"2023-08-27",dateText:"27 ago 2023",link:"https://youtu.be/kIVgwmy3AK8?si=luyi6jtIjntMkoxn",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de la banda argentina Los Negros, compartiendo escenario con Spiral Vortex. Episodio 3 del Ciclo Árbolazul #1.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"14/04/2023",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Emerson Lastra"], ["Iluminación en vivo", "Juan León"], ["Mezcla y masterización", "Manuel Collado"], ["Colabora", "Perdidos en el espacio"]]},
  {id:"p15",title:"Ciclo Árbolazul #1 Episodio 2: La ciencia simple",date:"2023-08-03",dateText:"3 ago 2023",link:"https://youtu.be/ytMOioy9-pQ?si=3hik8EbLqCpEBQfJ",category:"CICLO ÁRBOLAZUL",mood:[],description:"Presentación en vivo de La ciencia simple, compartiendo escenario con Fin del Mundo. Episodio 2 del Ciclo Árbolazul #1.",client:"Árbolazul ediciones",duration:"",director:{},venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"10/03/2023",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Roberto Marti"], ["Registro multipista", "Emerson Lastra"], ["Iluminación en vivo", "Bárbara Salas"], ["Mezcla y masterización", "Manuel Collado"], ["Colabora", "Perdidos en el espacio"]]},
  {id:"p16",title:"Ciclo Árbolazul #1 Episodio 1: Fin del mundo",date:"2023-07-03",dateText:"3 jul 2023",link:"https://youtu.be/h1ZSxzWxydY?si=sYpIXDgErNe7PdLx",category:"CICLO ÁRBOLAZUL",mood:[],description:"Registro en vivo de Fin del Mundo (Buenos Aires, Argentina), compartiendo escenario con La ciencia simple. Episodio 1 del Ciclo Árbolazul #1.",client:"Árbolazul ediciones",duration:"15:21",director:{},channel:"ArbolAzul ediciones",venue:"Sala Master, Radio U. de Chile — Santiago de Chile",recorded:"10/03/2023",credits:[["Producción", "Árbolazul ediciones"], ["Realización audiovisual", "RedRoom"], ["Videografía", "Aníbal Castillo y Víctor Quezada"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Sonido en vivo", "Juan Carlos Miranda"], ["Registro multipista", "Emerson Lastra"], ["Iluminación en vivo", "Juan León"], ["Mezcla y masterización", "Nicolás Aimo"], ["Colabora", "Perdidos en el espacio"]]},
  {id:"p17",title:"TRANSIENTE l La ciencia simple (Film completo 2021)",date:"2021-04-28",dateText:"28 abr 2021",link:"https://youtu.be/olYUH4Vomg8?si=2v4fDdaqZzZiQyU8",category:"CINE",mood:[],description:"Sesión filmada en una casona abandonada del barrio Yungay: La ciencia simple interpreta en vivo tres composiciones inéditas, con Andrés Quezada en percusión.",client:"La ciencia simple",duration:"",director:{},channel:"La ciencia simple",venue:"Casona abandonada, barrio Yungay — Santiago de Chile",credits:[["Producción audiovisual", "REDROOM"], ["Dirección audiovisual", "Víctor Quezada y Aníbal Castillo"], ["Cámaras", "Víctor Quezada y Aníbal Castillo"], ["Asistente de cámaras", "Andrea Gómez"], ["Montaje y post-producción de imagen", "Víctor Quezada"], ["Iluminación", "Bárbara Salas"], ["Gráficas", "55:12"], ["Registro de audio en vivo", "Jorge Silva y Danilo Pérez"], ["Mezcla de audio", "Jorge Silva"], ["Producción general", "La ciencia simple y Domingo Paredes"], ["Producción ejecutiva", "Rienzi Valencia"], ["Dirección general", "Gonzalo Valencia"], ["La ciencia simple", "Edgar Sandoval, Rienzi Valencia, Tomás Cornejo y Gonzalo Valencia"], ["Música invitada (percusión)", "Andrés Quezada"], ["Apoyo", "LeRockPsicophonique"]]},
  {id:"p18",title:"La ciencia simple – Noisetalgia",date:"2020-01-01",dateText:"1 ene 2020",link:"https://youtu.be/j-sFFPVfYuY?si=IZ09hiPdF5WaBNek",category:"EN VIVO",mood:[],description:"Registro en vivo de «Noisetalgia», tema del disco «III V VII» de La ciencia simple, en su concierto de 2019 en el Parque Cultural de Valparaíso.",client:"La ciencia simple · LeRockPsicophonique, Chancho Discos y Dunk!Records",duration:"",director:{},channel:"La ciencia simple",venue:"Teatro Parque Cultural de Valparaíso (Ex Cárcel) — Valparaíso",recorded:"15/03/2019",credits:[["Dirección y post-producción", "Víctor Quezada Carrasco"], ["Grabado por", "Víctor Quezada Carrasco y Aníbal Castillo Lillo"], ["Iluminación en vivo", "Javier Hechenleitner"], ["Stock footage", "John Mrubenstein; Beachfront B-Roll"], ["La ciencia simple", "Edgar Sandoval, Tomás Cornejo, Gonzalo Valencia y Rienzi Valencia"]]}
];
PROJECTS.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }); /* más reciente primero */
var MOODS = ["oscuro","cinematográfico","crudo","enérgico","emotivo","abstracto","elegante","caótico"];
/* RED AUDIOVISUAL VIVA. TODO: reemplaza los nodos DEMO por reales. Cada trabajo nuevo = un nodo "J" con l:[ids conectados]
   y add:"AAAA-MM" (mes en que se concretó). El botón CONSTRUIR LA RED reproduce el crecimiento en ese orden. ll = [lon, lat] aproximada. */
var NET_TYPES = {R:"REDROOM",B:"BANDAS",P:"ARTISTAS Y PERSONAS",E:"EMPRENDIMIENTOS",L:"LOCACIONES",J:"PROYECTOS",C:"COLABORACIONES"};
var NET = [
  {id:"rr",t:"R",n:"REDROOM",ll:[-71.66,-35.43],add:"2020-01",l:["vc","lo","co","su","ct","cm"]},
  {id:"ba",t:"B",n:"BANDA DEMO (TALCA)",ll:[-71.70,-35.40],add:"2021-03",l:["vc"]},
  {id:"vc",t:"J",n:"VIDEOCLIP DEMO",ll:[-71.62,-35.47],add:"2021-05",l:["ba","rr"]},
  {id:"lo",t:"L",n:"LOCACIÓN DEMO (SAN JAVIER)",ll:[-71.73,-35.60],add:"2021-05",l:["rr","fo"]},
  {id:"fo",t:"P",n:"FOTÓGRAFO DEMO",ll:[-71.24,-34.98],add:"2022-02",l:["lo","ev"]},
  {id:"ev",t:"C",n:"EVENTO DEMO",ll:[-71.45,-35.2],add:"2022-09",l:["fo","em"]},
  {id:"em",t:"E",n:"EMPRENDIMIENTO DEMO (LINARES)",ll:[-71.60,-35.85],add:"2022-09",l:["ev"]},
  {id:"ar",t:"P",n:"ARTISTA DEMO (CAUQUENES)",ll:[-72.32,-35.97],add:"2023-01",l:["co","cl"]},
  {id:"co",t:"J",n:"CORTOMETRAJE DEMO",ll:[-72.0,-35.7],add:"2023-04",l:["rr","ar"]},
  {id:"b2",t:"B",n:"BANDA DEMO (CONSTITUCIÓN)",ll:[-72.42,-35.33],add:"2023-08",l:["su"]},
  {id:"su",t:"J",n:"SESIÓN EN VIVO DEMO",ll:[-72.05,-35.25],add:"2023-08",l:["b2","rr","l2"]},
  {id:"l2",t:"L",n:"LOCACIÓN DEMO (CORDILLERA)",ll:[-70.8,-35.45],add:"2024-02",l:["su"]},
  {id:"ma",t:"E",n:"MARCA DEMO (MOLINA)",ll:[-71.28,-35.12],add:"2024-06",l:["ct"]},
  {id:"ct",t:"J",n:"VIDEO CORPORATIVO DEMO",ll:[-71.50,-35.30],add:"2024-06",l:["rr","ma"]},
  {id:"cl",t:"C",n:"COLABORACIÓN DEMO (PARRAL)",ll:[-71.83,-36.14],add:"2025-01",l:["ar","cm"]},
  {id:"cm",t:"J",n:"PROYECTO NUEVO DEMO",ll:[-71.9,-35.9],add:"2025-05",l:["rr","cl"]}
];
var MAULE_OUTLINE = [[-72.35,-34.95],[-72.1,-34.72],[-71.5,-34.66],[-70.9,-34.7],[-70.4,-34.9],[-70.55,-35.3],[-70.45,-35.7],[-70.6,-36.05],[-70.9,-36.35],[-71.6,-36.45],[-72.2,-36.38],[-72.7,-36.05],[-72.62,-35.75],[-72.5,-35.35]];
var MENU = [["DESCUBRIR","discover"],["TRABAJOS","work"],["COMERCIAL","commercial"],["ARTÍSTICO","artistic"],["SENSACIÓN","mood"],["ARMA TU PROYECTO","build"],["REDROOM MAULE","maule"],["NOSOTROS","about"],["COLABORA","collaborate"],["CONTACTO","contact"]];
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };
var CTA = '<a class="btn" href="build.html">SOLICITAR COTIZACIÓN</a>';

/* envio: hoy abre el correo (mailto). Cambia SOLO esta funcion para usar un servicio externo. */
function submitForm(subject, body) {
  location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

/* ---- YouTube: ID, portadas y reproductor ---- */
/* Acepta youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID, /live/ID, /v/ID y links con ?si=, &t=, etc. */
function ytId(url) {
  var m = String(url || "").match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([\w-]{11})/);
  return m ? m[1] : "";
}
function ytThumb(id, q) { return "https://img.youtube.com/vi/" + id + "/" + (q || "maxresdefault") + ".jpg"; }
function ytEmbed(id, auto) { return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1" + (auto ? "&autoplay=1" : ""); }
/* respaldo: si maxresdefault no existe (error, o YouTube devuelve su imagen gris de 120px) se usa hqdefault */
function thumbFallback(img) { if (img.dataset.fb) { img.style.display = "none"; return; } /* sin portada: queda el fondo negro */ img.dataset.fb = "1"; img.src = ytThumb(img.dataset.yt, "hqdefault"); }
function thumbCheck(img) { if (img.naturalWidth && img.naturalWidth <= 120) { thumbFallback(img); } }
function thumb(p, cls) {
  var id = ytId(p.link);
  return id ? '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + ytThumb(id) + '" data-yt="' + id + '" alt="" loading="lazy" onload="thumbCheck(this)" onerror="thumbFallback(this)">' : '';
}
function byId(id) { return PROJECTS.filter(function (x) { return x.id === id; })[0]; }
function meta(p) { return [p.category, p.dateText].filter(Boolean).join(" · "); }
function info(p) { return [p.category, p.client, p.duration].filter(Boolean).join(" · "); }
function frame(p, auto) {
  var id = ytId(p.link);
  return id ? '<div class="pframe"><iframe src="' + ytEmbed(id, auto) + '" title="' + esc(p.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' : '';
}

function card(p) {
  return '<a class="card rv" href="project.html?id=' + p.id + '" data-play="' + p.id + '" aria-label="Ver ' + esc(p.title) + '"><i>' + thumb(p) + '</i><span class="demo">' + (p.demo ? "DEMO" : esc(p.dateText)) + '</span><span class="play" aria-hidden="true"></span><div><b>' + esc(p.title) + '</b>' + (p.category ? '<small>' + esc(p.category) + '</small>' : '') + '</div></a>';
}
function chips(list, cur, attr) {
  return '<div class="chips" role="group">' + list.map(function (c) { return '<button class="btn' + (c === cur ? ' on' : '') + '" ' + attr + '="' + c + '">' + c + '</button>'; }).join("") + '</div>';
}
function section(h, t, extra) { return '<div class="wrap"><p class="tag">' + t + '</p><h2 class="rv">' + h + '</h2>' + (extra || "") + '</div>'; }
function service(items, cta) {
  return '<div class="wrap">' + items.map(function (s) {
    return '<hr class="line"><div class="two rv"><h2>' + s[0] + '</h2><div><p>' + s[1] + '</p><br>' + (cta ? CTA : '<a class="btn" href="collaborate.html">CREEMOS ALGO JUNTOS</a>') + '</div></div>';
  }).join("") + '</div>';
}

var PAGES = {
  discover: function () {
    return '<div class="wrap"><p class="tag">DESCUBRIR</p><h1 class="rv">NO SOLO GRABAMOS HISTORIAS.<br><span class="red">CONSTRUIMOS MUNDOS.</span></h1><hr class="line rv"></div>' +
      section('TRABAJOS DESTACADOS', 'EXPLORA', '<div class="grid">' + featured().map(card).join("") + '</div><br><a class="btn" href="work.html">VER TODO</a>') +
      '<div class="wrap"><hr class="line"><h2 class="rv">PRIMERO SIÉNTELO. DESPUÉS LO CONSTRUIMOS.</h2><br><a class="btn" href="mood.html">EXPLORAR POR SENSACIÓN</a> <a class="btn" href="build.html">EMPEZAR UN PROYECTO</a></div>';
  },
  work: function () {
    var cats = usedCategories(); /* solo categorías que tienen al menos un video */
    return section('TRABAJOS', 'PORTAFOLIO · ' + PROJECTS.length + ' VIDEOS', (cats.length > 1 ? chips(["TODOS"].concat(cats), "TODOS", "data-c") : '') + '<div class="grid" id="g"></div><br><a class="btn" href="mood.html">O EXPLORA POR SENSACIÓN</a>');
  },
  mood: function () {
    var used = usedMoods(); /* solo sensaciones asignadas a algún video (campo mood en PROJECTS) */
    return section('¿QUÉ QUIERES SENTIR?', 'BÚSQUEDA POR SENSACIÓN', (used.length ? chips(used.map(function (m) { return m.toUpperCase(); }), "", "data-m") : '<p class="tag" style="margin-top:1.5rem">PRONTO PODRÁS EXPLORAR POR SENSACIÓN. MIENTRAS TANTO, ENTRA A TODOS LOS TRABAJOS.</p>') + '<div class="grid" id="g"></div><br>' + CTA);
  },
  commercial: function () {
    return '<div class="wrap"><p class="tag">COMERCIAL</p><h1 class="rv">RESULTADOS QUE SE VEN COMO CINE</h1></div>' + service([
      ["EVENTOS", "Cobertura audiovisual pensada para recordar la emoción del día."], ["MATRIMONIOS", "Una historia filmada con mirada cinematográfica."],
      ["CORPORATIVO", "Videos que muestran a tu empresa con claridad y estilo."], ["REDES SOCIALES", "Piezas cortas con identidad para redes."],
      ["PUBLICIDAD", "Conceptos y piezas para campañas."], ["CONTENIDO PARA MARCAS", "Contenido recurrente con una estética propia."]], true);
  },
  artistic: function () {
    return '<div class="wrap"><p class="tag">ARTÍSTICO</p><h1 class="rv">NUESTROS <span class="red">MUNDOS</span></h1><p>Proyectos propios y colaborativos.</p></div>' + service([
      ["CORTOMETRAJES", "Cortometrajes de autor."], ["VIDEOCLIPS", "Videoclips con identidad."], ["SESIONES EN VIVO", "Conciertos en vivo registrados como cine."],
      ["EXPERIMENTAL", "Exploración de imagen y sonido."], ["DOCUMENTAL / OTROS", "Otras formas de contar."]], false);
  },
  build: function () { return '<div class="wrap"><p class="tag">ARMA TU PROYECTO</p><div id="b"></div></div>'; },
  maule: function () {
    return '<div class="wrap"><p class="tag">REDROOM MAULE</p><h1 class="rv">LA RED <span class="red">VIVA</span></h1><p>Cada punto es una persona, banda, emprendimiento, locación o proyecto del Maule. Toca uno y mira con quién se conecta.</p><br><button class="btn" id="bn">CONSTRUIR LA RED</button><canvas id="net" class="net" role="img" aria-label="Red audiovisual del Maule: puntos rojos conectados por líneas"></canvas><div class="two" style="margin-top:1.5rem"><div aria-live="polite"><p class="tag">CONEXIÓN</p><p id="chain">Selecciona un punto para generar su constelación.</p></div><div><p class="tag" id="yr">LA RED HOY</p><div id="stats"></div></div></div><div class="chips" id="nlist" aria-label="Lista de puntos de la red"></div><p class="tag">DEMO: nodos de ejemplo. Cada proyecto realizado agrega una conexión nueva.</p><br>' + CTA + '</div>';
  },
  about: function () {
    return '<div class="wrap"><p class="tag">NOSOTROS</p><h1 class="rv">REDROOM</h1><p>Redroom nace desde una búsqueda cinematográfica y audiovisual de dos cineastas de la Universidad de Valparaíso.</p><div class="grid"><div class="card rv"><i></i><span class="demo">PLACEHOLDER</span><div><b>ANÍBAL CASTILLO</b><small>Cineasta. TODO: biografía real.</small></div></div><div class="card rv"><i></i><span class="demo">PLACEHOLDER</span><div><b>VÍCTOR QUEZADA</b><small>Cineasta. TODO: biografía real.</small></div></div></div><br>' + CTA + '</div>';
  },
  collaborate: function () {
    return '<div class="wrap"><p class="tag">COLABORA</p><h1 class="rv">CREEMOS <span class="red">ALGO JUNTOS</span></h1><p>MÚSICOS · ARTISTAS · CINEASTAS · ACTORES · DISEÑADORES · EMPRENDEDORES · MARCAS · PRODUCTORAS</p>' +
      fform("cf", [["Nombre", "name"], ["Tipo de proyecto", "type"], ["Instagram / redes", "social"], ["Descripción", "desc", 1], ["Qué buscas realizar", "goal", 1]], "ENVIAR") + '</div>';
  },
  contact: function () {
    return '<div class="wrap"><p class="tag">CONTACTO</p><h1 class="rv">REDROOM</h1><p><a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a> · <a href="' + CONFIG.instagram + '" rel="noopener">INSTAGRAM</a> · <a href="' + CONFIG.youtube + '" rel="noopener">YOUTUBE</a></p>' +
      fform("ct", [["Nombre", "name"], ["Correo", "email"], ["Mensaje", "msg", 1]], "EMPEZAR UN PROYECTO") + '<br><h2>NOS VEMOS EN LA SALA.</h2></div>';
  },
  project: function () {
    var id = new URLSearchParams(location.search).get("id");
    var p = byId(id) || PROJECTS[0], k = PROJECTS.indexOf(p);
    var prev = PROJECTS[k - 1], next = PROJECTS[k + 1];
    document.title = "REDROOM — " + p.title;
    return '<div class="wrap"><p class="tag">' + esc(meta(p)) + '</p><h1 class="ptitle">' + esc(p.title) + '</h1>' + (p.description ? '<p>' + esc(p.description) + '</p>' : '') + (info(p) ? '<p class="tag">' + esc(info(p)) + '</p>' : '') + '<br>' + frame(p, false) +
      '<p style="margin-top:1rem"><a class="btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">VER EN YOUTUBE</a></p><p class="tag" style="margin-top:2rem">MODO DIRECTOR</p>' +
      chips(Object.keys(DIRECTOR_MODES), "ENCUADRE", "data-d") + '<div class="card" id="dm" style="aspect-ratio:16/7"><i>' + thumb(p) + '</i><div><b id="dt">ENCUADRE</b><small id="dd">' + esc(directorText(p, "ENCUADRE")) + '</small></div></div><br>' + ficha(p) + CTA + ' <a class="btn" href="work.html">VOLVER A TRABAJOS</a>' +
      '<hr class="line"><div class="pnav">' + (prev ? '<a href="project.html?id=' + prev.id + '"><small class="tag">← MÁS RECIENTE</small><b>' + esc(prev.title) + '</b></a>' : '<span></span>') + (next ? '<a href="project.html?id=' + next.id + '" style="text-align:right"><small class="tag">ANTERIOR →</small><b>' + esc(next.title) + '</b></a>' : '') + '</div></div>';
  }
};
function fform(id, fields, label) {
  return '<form id="' + id + '">' + fields.map(function (f) {
    return '<div><label for="' + id + f[1] + '">' + f[0].toUpperCase() + '</label>' + (f[2] ? '<textarea id="' + id + f[1] + '" name="' + f[0] + '" rows="4" required></textarea>' : '<input id="' + id + f[1] + '" name="' + f[0] + '" ' + (f[1] === "email" ? 'type="email"' : '') + ' required>') + '</div>';
  }).join("") + '<button class="btn" type="submit">' + label + '</button></form>';
}

var INIT = {
  work: function () { renderGrid(function (p, c) { return c === "TODOS" || p.category === c; }, "data-c", "TODOS"); },
  mood: function () { renderGrid(function (p, m) { return !m || (p.mood || []).indexOf(m.toLowerCase()) > -1; }, "data-m", ""); },
  project: function () {
    var p = byId(new URLSearchParams(location.search).get("id")) || PROJECTS[0];
    $$("[data-d]").forEach(function (b) {
      b.onclick = function () {
        $$("[data-d]").forEach(function (x) { x.classList.toggle("on", x === b); });
        $("#dt").textContent = b.dataset.d; $("#dd").textContent = directorText(p, b.dataset.d);
      };
    });
    $("[data-d]").classList.add("on");
  },
  maule: netInit,
  collaborate: function () { bindForm("cf", "Colaboración Redroom"); },
  contact: function () { bindForm("ct", "Contacto Redroom"); },
  build: buildFlow
};
var DIRECTOR_MODES = {"ENCUADRE": "Composición y encuadre", "CÁMARA": "Cámara y lentes", "LUZ": "Diseño de luz", "COLOR": "Color y look", "MONTAJE": "Montaje y ritmo", "DETRÁS DE CÁMARAS": "Detrás de cámaras"};
/* Cada modo toma los créditos cuyo rol contiene alguna de estas palabras */
var DIRECTOR_KEYS = {"ENCUADRE": ["dirección de fotografía", "dirección audiovisual", "dirección,", "dirección y", "idea original"], "CÁMARA": ["videografía", "cámara", "fotografía", "grabado"], "LUZ": ["ilumina", "lumínica"], "COLOR": ["post-producción", "postproducción"], "MONTAJE": ["montaje"], "DETRÁS DE CÁMARAS": ["realización", "producción audiovisual", "producción", "making of", "sonido", "registro", "mezcla", "dirección de arte", "colabora"]};
function ficha(p) {
  var rows = [["Lugar", p.venue], ["Fecha de grabación", p.recorded], ["Publicado", p.dateText], ["Canal", p.channel], ["Duración", p.duration]].filter(function (r) { return r[1]; }).concat(p.credits || []);
  return rows.length ? '<p class="tag" style="margin-top:2rem">FICHA TÉCNICA</p><dl class="ficha">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("") + '</dl>' : '';
}
function directorText(p, k) {
  if (p.director && p.director[k]) { return p.director[k]; }
  var keys = DIRECTOR_KEYS[k] || [], hits = (p.credits || []).filter(function (c) {
    var r = c[0].toLowerCase() + ","; return keys.some(function (w) { return r.indexOf(w) > -1; });
  });
  return hits.length ? hits.map(function (c) { return c[0] + ": " + c[1]; }).join(" · ") : DIRECTOR_MODES[k] + ": sin información publicada para este video.";
}
function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }); }
function usedCategories() { return uniq(PROJECTS.map(function (p) { return p.category; })); }
function usedMoods() { var all = [].concat.apply([], PROJECTS.map(function (p) { return p.mood || []; })); return MOODS.filter(function (m) { return all.indexOf(m) > -1; }); }
function featured() { var f = PROJECTS.filter(function (p) { return p.featured; }); return (f.length ? f : PROJECTS).slice(0, 4); }

/* Reproductor en modal: clic en una tarjeta abre el video. Ctrl/Cmd+clic o clic central abre la ficha del proyecto. */
var lastFocus = null;
function openPlayer(p) {
  var pl = $("#player"); if (!pl || !ytId(p.link)) { location.href = "project.html?id=" + p.id; return; }
  lastFocus = document.activeElement;
  pl.innerHTML = '<div class="pbox"><div class="ptop"><p class="tag">' + esc(meta(p)) + '</p><button class="x" id="pclose" aria-label="Cerrar video">CERRAR</button></div><h2>' + esc(p.title) + '</h2>' + frame(p, true) +
    (p.description ? '<p class="pdesc">' + esc(p.description) + '</p>' : '') + ficha(p) +
    '<div class="pact"><a class="btn" href="project.html?id=' + p.id + '">FICHA Y MODO DIRECTOR</a> <a class="btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">VER EN YOUTUBE</a></div></div>';
  pl.classList.add("on"); document.body.style.overflow = "hidden";
  $("#pclose").onclick = closePlayer; $("#pclose").focus();
}
function closePlayer() {
  var pl = $("#player"); if (!pl || !pl.classList.contains("on")) { return; }
  pl.classList.remove("on"); pl.innerHTML = ""; document.body.style.overflow = ""; /* vaciar detiene el video */
  if (lastFocus) { lastFocus.focus(); }
}
document.addEventListener("click", function (e) {
  var a = e.target.closest ? e.target.closest("[data-play]") : null;
  if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
  var p = byId(a.dataset.play); if (!p) { return; }
  e.preventDefault(); openPlayer(p);
});

function renderGrid(filter, attr, start) {
  var cur = start, g = $("#g");
  function draw() {
    var list = PROJECTS.filter(function (p) { return filter(p, cur); });
    g.innerHTML = list.length ? list.map(card).join("") : '<p>Sin proyectos para esta selección.</p>';
    $$(".rv", g).forEach(function (e) { setTimeout(function () { e.classList.add("in"); }, 30); });
    document.body.dataset.mood = cur;
  }
  $$("[" + attr + "]").forEach(function (b) {
    b.onclick = function () { cur = b.getAttribute(attr); $$("[" + attr + "]").forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); };
  });
  draw();
}
function bindForm(id, subject) {
  $("#" + id).onsubmit = function (e) {
    e.preventDefault();
    var body = $$("input,textarea", this).map(function (i) { return i.name + ": " + i.value; }).join("\n");
    submitForm(subject, body);
  };
}

function buildFlow() {
  var steps = [
    {k: "TIPO DE PROYECTO", q: "¿QUÉ ESTÁS CREANDO?", o: ["VIDEO CORPORATIVO", "VIDEOCLIP", "EVENTO", "MATRIMONIO", "CORTOMETRAJE", "REDES SOCIALES", "SESIÓN EN VIVO", "OTRO"]},
    {k: "SENSACIÓN", q: "¿QUÉ QUIERES QUE SIENTA LA GENTE?", o: ["CINEMATOGRÁFICO", "EMOTIVO", "ENÉRGICO", "OSCURO", "CRUDO", "ELEGANTE", "EXPERIMENTAL"]},
    {k: "LUGAR", q: "¿DÓNDE?", o: ["TALCA", "MAULE", "VALPARAÍSO", "SANTIAGO", "OTRO"]},
    {k: "IDEA", q: "CUÉNTANOS TU IDEA", t: 1},
    {k: "CONTACTO", q: "DATOS DE CONTACTO", c: 1}
  ], i = 0, a = {}, root = $("#b");
  function show() {
    if (i >= steps.length) {
      var sum = Object.keys(a).map(function (k) { return k + ": " + a[k]; }).join("\n");
      root.innerHTML = '<h1>TU PROYECTO<br><span class="red">ESTÁ LISTO.</span></h1><pre class="sum">' + esc(sum) + '</pre><button class="btn" id="send">ENVIAR PROYECTO</button> <button class="btn" id="back">EDITAR</button>';
      $("#send").onclick = function () { submitForm("Solicitud de cotización Redroom", sum); };
      $("#back").onclick = function () { i = 0; show(); };
      return;
    }
    var s = steps[i], h = '<p class="tag">PASO ' + (i + 1) + ' / ' + steps.length + '</p><h1>' + s.q + '</h1>';
    if (s.o) { h += '<div class="opt">' + s.o.map(function (o) { return '<button class="btn' + (a[s.k] === o ? ' on' : '') + '" data-o="' + o + '">' + o + '</button>'; }).join("") + '</div>'; }
    else if (s.t) { h += '<form id="st"><textarea aria-label="Idea" id="v" rows="5">' + esc(a.IDEA || "") + '</textarea><button class="btn" type="submit">SIGUIENTE</button></form>'; }
    else { h += '<form id="st">' + [["Nombre", "n", 1], ["Correo", "e", 1], ["Teléfono", "p", 1], ["Instagram (opcional)", "i", 0]].map(function (f) { return '<div><label for="' + f[1] + '">' + f[0].toUpperCase() + '</label><input id="' + f[1] + '"' + (f[1] === "e" ? ' type="email"' : '') + (f[2] ? ' required' : '') + '></div>'; }).join("") + '<button class="btn" type="submit">TERMINAR</button></form>'; }
    h += i ? '<br><button class="btn" id="prev">ATRÁS</button>' : '';
    root.innerHTML = h;
    $$("[data-o]").forEach(function (b) { b.onclick = function () { a[s.k] = b.dataset.o; i++; show(); }; });
    var f = $("#st");
    if (f) { f.onsubmit = function (e) { e.preventDefault(); if (s.t) { a.IDEA = $("#v").value || "-"; } else { a.NOMBRE = $("#n").value; a.CORREO = $("#e").value; a.TELÉFONO = $("#p").value; a.INSTAGRAM = $("#i").value || "-"; } i++; show(); }; }
    if ($("#prev")) { $("#prev").onclick = function () { i--; show(); }; }
  }
  show();
}

function chrome() {
  var cur = document.body.dataset.page;
  document.body.insertAdjacentHTML("afterbegin",
    '<header class="top"><a href="index.html" aria-label="REDROOM, inicio">REDROOM</a><button id="mb" aria-expanded="false" aria-controls="menu">MENÚ</button></header>' +
    '<nav class="menu" id="menu" aria-label="Principal"><button class="x" id="mx">CERRAR</button>' + MENU.map(function (m) { return '<a href="' + m[1] + '.html"' + (m[1] === cur ? ' aria-current="page"' : '') + '>' + m[0] + '</a>'; }).join("") + '</nav>' +
    '<div class="stage" id="stage" role="dialog" aria-label="Modo experiencia Redroom"></div>' +
    '<div class="player" id="player" role="dialog" aria-modal="true" aria-label="Reproductor de video Redroom"></div>' +
    '<button class="rbtn" id="rb" aria-label="Botón rojo: modo experiencia Redroom" title="EL BOTÓN ROJO"></button>');
  var m = $("#menu");
  function tog(o) { m.classList.toggle("open", o); $("#mb").setAttribute("aria-expanded", o); if (o) { $("#mx").focus(); } }
  $("#mb").onclick = function () { tog(true); }; $("#mx").onclick = function () { tog(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { tog(false); stopExp(); closePlayer(); } });
  $("#player").onclick = function (e) { if (e.target === this) { closePlayer(); } }; /* clic fuera del video cierra */
  var timer;
  function stopExp() { clearInterval(timer); $("#stage").classList.remove("on"); document.body.classList.remove("exp"); if (document.fullscreenElement) { document.exitFullscreen(); } }
  $("#rb").onclick = function () { /* EXPERIENCE MODE: fullscreen + navegacion oculta + presentacion de proyectos (ESC sale) */
    var st = $("#stage"), n = 0;
    if (st.classList.contains("on")) { stopExp(); return; }
    document.body.classList.add("exp"); st.classList.add("on");
    if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen().catch(function () {}); }
    function f() { var p = PROJECTS[n++ % PROJECTS.length]; st.innerHTML = thumb(p, "sbg") + '<div class="sin"><p class="tag">' + esc(meta(p)) + '</p><h1>' + esc(p.title) + '</h1><p><a class="btn" href="project.html?id=' + p.id + '">VER ESTE TRABAJO</a></p><p class="tag">ESC O EL BOTÓN ROJO PARA SALIR</p></div>'; }
    f(); timer = setInterval(f, 2800);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.dataset.page;
  if (page === "index") { return enterRoom(); }
  chrome();
  $("#app").innerHTML = PAGES[page]();
  if (INIT[page]) { INIT[page](); }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold: .15}) : null;
  $$(".rv").forEach(function (e) { io ? io.observe(e) : e.classList.add("in"); });
});

function enterRoom() {
  var h = $(".hero"), go = function () { h.classList.add("go"); setTimeout(function () { location.href = "discover.html"; }, 1100); };
  $("#enter").onclick = go;
  document.addEventListener("keydown", function (e) { if (e.key === "Enter") { go(); } });
  setTimeout(function () { $("#load").textContent = "LISTO"; $("#enter").hidden = false; $("#enter").focus(); }, 900);
}

/* INNOVACION: la CLAQUETA. Al terminar el formulario, tu proyecto se convierte en una claqueta de cine. */
function claqueta(a) {
  function c(l, v) { return '<div><small>' + l + '</small><b>' + esc(v || "-") + '</b></div>'; }
  return '<div class="slate"><div class="clap"></div><div class="sg">' + c("PROYECTO", a["TIPO DE PROYECTO"]) + c("SENSACIÓN", a["SENSACIÓN"]) + c("LUGAR", a["LUGAR"]) + c("PRODUCTORA", "REDROOM") + c("FECHA", new Date().toLocaleDateString("es-CL")) + c("TOMA", "1") + '</div></div>';
}
/* INNOVACION: el VISOR. En pantallas con mouse, un visor de cámara sigue el cursor y "encuadra" lo que miras. */
function viewfinder() {
  if (!window.matchMedia("(pointer:fine)").matches || window.matchMedia("(prefers-reduced-motion:reduce)").matches) { return; }
  var v = document.createElement("div"); v.className = "vf"; v.setAttribute("aria-hidden", "true");
  v.innerHTML = '<i></i><i></i><i></i><i></i><span id="vft"></span>'; document.body.appendChild(v);
  var t0 = Date.now(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
  document.addEventListener("mousemove", function (e) {
    var el = e.target.closest ? e.target.closest("a,button,.card") : null, r = el && el.getBoundingClientRect();
    v.classList.toggle("lock", !!el);
    if (el && !el.classList.contains("dot")) { v.style.cssText = "transform:translate(" + r.left + "px," + r.top + "px);width:" + r.width + "px;height:" + r.height + "px"; }
    else { v.style.cssText = "transform:translate(" + (e.clientX - 40) + "px," + (e.clientY - 28) + "px)"; }
  });
  setInterval(function () { var s = Math.floor((Date.now() - t0) / 1000); $("#vft").innerHTML = '<em>●</em> REC ' + pad(Math.floor(s / 60)) + ":" + pad(s % 60) + (v.classList.contains("lock") ? " · EN CUADRO" : ""); }, 250);
}
document.addEventListener("DOMContentLoaded", viewfinder);

/* ---- Red audiovisual viva (canvas) ---- */
function netInit() {
  var cv = $("#net"), c = cv.getContext("2d"), W = 0, H = 0, now = 0, sel = null, lev = {}, vis = {}, timer = null, building = false;
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches, byId = {}, E = [], seen = {};
  NET.forEach(function (n, i) { n.i = i; byId[n.id] = n; vis[n.id] = true; });
  NET.forEach(function (n) { n.l.forEach(function (o) { var k = [n.id, o].sort().join("-"); if (!seen[k] && byId[o]) { seen[k] = 1; E.push({a: n, b: byId[o], t0: null}); } }); });
  function size() { var d = window.devicePixelRatio || 1; W = cv.clientWidth; H = Math.round(W * 0.62); cv.style.height = H + "px"; cv.width = W * d; cv.height = H * d; c.setTransform(d, 0, 0, d, 0, 0); }
  function xy(ll, n) {
    var m = 30, t = reduce || !n ? 0 : now;
    return [m + (ll[0] + 72.9) / 2.7 * (W - 2 * m) + (n ? 6 * Math.sin(t / 1700 + n.i) : 0), m + (-34.6 - ll[1]) / 1.95 * (H - 2 * m) + (n ? 5 * Math.cos(t / 2100 + n.i * 1.7) : 0)];
  }
  function stats() {
    var cnt = {}, k, e = 0, h = "";
    NET.forEach(function (n) { if (vis[n.id]) { cnt[n.t] = (cnt[n.t] || 0) + 1; } });
    E.forEach(function (x) { if (vis[x.a.id] && vis[x.b.id] && (!building || x.t0 !== null)) { e++; } });
    for (k in NET_TYPES) { h += '<p><b class="red">' + (cnt[k] || 0) + '</b> ' + NET_TYPES[k] + '</p>'; }
    $("#stats").innerHTML = h + '<p><b class="red">' + e + '</b> CONEXIONES</p>';
  }
  function select(n) {
    sel = n; lev = {}; lev[n.id] = 0; var q = [n], lines = [], i;
    while (q.length) { var u = q.shift(); E.forEach(function (x) { var v = x.a === u ? x.b : (x.b === u ? x.a : null); if (v && vis[v.id] && lev[v.id] === undefined) { lev[v.id] = lev[u.id] + 1; q.push(v); } }); }
    E.forEach(function (x) { x.t0 = (lev[x.a.id] !== undefined && lev[x.b.id] !== undefined) ? now + Math.min(lev[x.a.id], lev[x.b.id]) * 450 : null; });
    NET.forEach(function (m) { if (lev[m.id] !== undefined) { (lines[lev[m.id]] = lines[lev[m.id]] || []).push(m.n); } });
    $("#chain").textContent = lines.map(function (l) { return l.join(" · "); }).join("  →  ");
    if (reduce) { draw(); }
  }
  function draw() {
    now = Date.now(); c.clearRect(0, 0, W, H);
    c.beginPath(); MAULE_OUTLINE.forEach(function (q, i) { var p = xy(q, null); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.strokeStyle = "#1a1a1a"; c.lineWidth = 1; c.stroke();
    E.forEach(function (x) {
      if (x.t0 === null || !vis[x.a.id] || !vis[x.b.id]) { return; }
      var p = reduce ? 1 : Math.max(0, Math.min(1, (now - x.t0) / 450)); if (!p) { return; }
      var a = xy(x.a.ll, x.a), b = xy(x.b.ll, x.b);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p); c.strokeStyle = "rgba(225,6,0,.9)"; c.lineWidth = 1.5; c.stroke();
    });
    NET.forEach(function (n) {
      if (!vis[n.id]) { return; }
      var p = xy(n.ll, n), on = sel ? lev[n.id] !== undefined && now > (lev[n.id] * 450 + 300 - 450 * (lev[n.id] ? 0 : 1)) : true;
      c.globalAlpha = on ? 1 : .3; c.beginPath(); c.arc(p[0], p[1], n.t === "R" ? 9 : 5, 0, 7); c.fillStyle = "#e10600"; c.fill();
      if (n === sel || n.t === "R") { c.strokeStyle = "#f2f2f2"; c.lineWidth = 1.5; c.beginPath(); c.arc(p[0], p[1], n.t === "R" ? 14 : 11, 0, 7); c.stroke(); }
      if (sel && on && lev[n.id] !== undefined) { c.fillStyle = "#f2f2f2"; c.font = "11px monospace"; c.fillText(n.n, p[0] + 10, p[1] - 9); }
      c.globalAlpha = 1;
    });
  }
  function loop() { if (!document.hidden) { draw(); } requestAnimationFrame(loop); }
  function nearest(x, y) { var best = null, d = 24; NET.forEach(function (n) { if (vis[n.id]) { var p = xy(n.ll, n), k = Math.hypot(p[0] - x, p[1] - y); if (k < d) { d = k; best = n; } } }); return best; }
  cv.onclick = function (e) { var r = cv.getBoundingClientRect(), n = nearest(e.clientX - r.left, e.clientY - r.top); if (n) { select(n); } };
  $("#nlist").innerHTML = NET.map(function (n) { return '<button class="btn" data-n="' + n.id + '">' + esc(n.n) + '</button>'; }).join("");
  $$("[data-n]").forEach(function (b) { b.onclick = function () { if (vis[b.dataset.n]) { select(byId[b.dataset.n]); cv.scrollIntoView({block: "center", behavior: reduce ? "auto" : "smooth"}); } }; });
  $("#bn").onclick = function () {
    clearInterval(timer);
    if (building) { building = false; NET.forEach(function (n) { vis[n.id] = true; }); sel = null; E.forEach(function (x) { x.t0 = null; }); $("#bn").textContent = "CONSTRUIR LA RED"; $("#yr").textContent = "LA RED HOY"; $("#chain").textContent = "Selecciona un punto para generar su constelación."; stats(); return; }
    building = true; sel = null; NET.forEach(function (n) { vis[n.id] = false; }); E.forEach(function (x) { x.t0 = null; });
    var order = NET.slice().sort(function (a, b) { return a.add < b.add ? -1 : 1; }), i = 0;
    $("#bn").textContent = "VOLVER A EXPLORAR";
    function step() {
      if (i >= order.length) { clearInterval(timer); $("#chain").textContent = "La red completa: así ha crecido Redroom en el Maule."; return; }
      var n = order[i++]; vis[n.id] = true; $("#yr").textContent = "CRECIMIENTO · " + n.add;
      E.forEach(function (x) { if (x.t0 === null && vis[x.a.id] && vis[x.b.id]) { x.t0 = Date.now(); } });
      stats();
    }
    if (reduce) { while (i < order.length) { step(); } draw(); } else { step(); timer = setInterval(step, 800); }
  };
  window.addEventListener("resize", function () { size(); if (reduce) { draw(); } });
  size(); stats(); E.forEach(function (x) { x.t0 = null; });
  if (reduce) { draw(); } else { loop(); }
}
