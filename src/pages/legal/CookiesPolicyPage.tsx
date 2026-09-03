import { LegalDocument, LegalSection, LegalParagraph, LegalList } from '../../components/legal/LegalDocument';

export function CookiesPolicyPage() {
  return (
    <LegalDocument
      title="Política de cookies"
      intro="Roady no utiliza cookies de rastreo ni analítica de terceros. Esta página explica, con total transparencia, qué tecnologías de almacenamiento usa la app y para qué."
    >
      <LegalSection heading="1. Roady no usa cookies">
        <LegalParagraph>
          En sentido estricto, Roady no coloca ninguna cookie (archivo <code>document.cookie</code>) en tu navegador.
          Toda la información que la app guarda en tu dispositivo se almacena mediante <strong>localStorage</strong>, una
          tecnología equivalente a efectos de la normativa (art. 22.2 LSSI-CE), pero con una diferencia importante: nunca
          se envía automáticamente a ningún servidor, solo la lee la propia app cuando la usas.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Qué guardamos en tu dispositivo y por qué">
        <LegalParagraph>
          Todo lo que guardamos es <strong>técnico o de preferencia</strong>, necesario para que la app funcione o para
          recordar cómo la configuraste. No usamos ninguna cookie o almacenamiento con fines analíticos ni
          publicitarios.
        </LegalParagraph>
        <LegalList
          items={[
            <>
              <strong>Sesión de acceso</strong> — mantiene tu sesión iniciada entre visitas, para que no tengas que
              volver a hacer login cada vez. Estrictamente necesaria.
            </>,
            <>
              <strong>Progreso local</strong> — copia de tu XP, racha, lecciones y categorías, usada como respaldo junto
              a la sincronización con tu cuenta. Estrictamente necesaria.
            </>,
            <>
              <strong>Preferencia de tema</strong> (claro/oscuro) y <strong>sonidos/vibración</strong> — recuerdan cómo
              prefieres ver y sentir la app. Preferencia.
            </>,
            <>
              <strong>Estado del tutorial de bienvenida</strong> — para no repetírtelo si ya lo completaste. Necesaria
              para el funcionamiento de la interfaz.
            </>,
            <>
              <strong>Aviso de instalación como app</strong> — recuerda si ya descartaste la sugerencia de instalar
              Roady, para no insistir. Preferencia.
            </>,
            <>
              <strong>Notificaciones y solicitudes de amistad ya vistas</strong>, y <strong>invitaciones pendientes de
              amigo</strong> — necesarias para el funcionamiento de la función social.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. Consentimiento">
        <LegalParagraph>
          El artículo 22.2 de la LSSI-CE exime del deber de solicitar consentimiento a las cookies o tecnologías
          "estrictamente necesarias para la prestación de un servicio expresamente solicitado por el usuario". Todo lo
          que guardamos en tu dispositivo entra en esa categoría o es una preferencia de la propia interfaz que tú
          controlas directamente desde Ajustes — por eso no te mostramos un banner de "aceptar/rechazar cookies": no
          tenemos ninguna cookie no esencial que pedirte permiso para activar.
        </LegalParagraph>
        <LegalParagraph>
          Puedes borrar en cualquier momento estos datos desde la configuración de tu navegador (Cookies y datos de
          sitios → Roady), aunque eso también borrará tus preferencias locales y, si no has iniciado sesión, tu
          progreso.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="4. Un servicio externo: Google Fonts">
        <LegalParagraph>
          Para mostrar el logotipo "Roady" con su tipografía, la app carga un fichero desde los servidores de Google
          Fonts (<code>fonts.googleapis.com</code> y <code>fonts.gstatic.com</code>). Esto implica que tu navegador hace
          una petición directa a Google, que puede recibir tu dirección IP y tu user-agent como parte de cualquier
          petición HTTP estándar. Google no recibe ningún otro dato de tu cuenta ni de tu actividad en Roady a través de
          esta petición.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="5. Lo que NO hacemos">
        <LegalList
          items={[
            'No usamos Google Analytics ni ninguna otra herramienta de analítica de uso.',
            'No usamos cookies o píxeles de publicidad.',
            'No usamos herramientas de fingerprinting ni de rastreo entre sitios.',
            'No compartimos tu actividad en la app con redes sociales ni anunciantes.',
          ]}
        />
        <LegalParagraph>
          Si en el futuro incorporamos alguna herramienta que sí requiera tu consentimiento (por ejemplo, analítica),
          actualizaremos esta página e implementaremos el mecanismo de consentimiento correspondiente antes de
          activarla.
        </LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
}
