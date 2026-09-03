import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection, LegalParagraph, LegalList } from '../../components/legal/LegalDocument';
import { LEGAL_RESPONSABLE_NOMBRE, LEGAL_RESPONSABLE_NIF, LEGAL_RESPONSABLE_DIRECCION, LEGAL_CONTACT_EMAIL } from '../../data/legalInfo';

export function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Política de privacidad"
      intro="Esta política explica qué datos recoge Roady, para qué los usamos y qué derechos tienes sobre ellos, conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD)."
    >
      <LegalSection heading="1. Responsable del tratamiento">
        <LegalParagraph>
          <strong>{LEGAL_RESPONSABLE_NOMBRE}</strong>, NIF {LEGAL_RESPONSABLE_NIF}, con domicilio en {LEGAL_RESPONSABLE_DIRECCION}.
          Contacto para cuestiones de privacidad: {LEGAL_CONTACT_EMAIL}.
        </LegalParagraph>
        <LegalParagraph>
          Estos datos están pendientes de confirmación por el titular de la aplicación y se actualizarán en cuanto estén
          disponibles. Mientras tanto, cualquier solicitud puede dirigirse a través de los canales de contacto habituales
          de la app.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Qué datos recogemos">
        <LegalParagraph>Solo recogemos los datos necesarios para que Roady funcione:</LegalParagraph>
        <LegalList
          items={[
            <>
              <strong>Datos de cuenta:</strong> nombre que introduces al registrarte y email, gestionados por nuestro
              proveedor de autenticación (Supabase). Tu contraseña nunca se almacena en texto plano.
            </>,
            <>
              <strong>Progreso y estadísticas:</strong> XP, nivel, racha, lecciones completadas, categorías desbloqueadas,
              resultados de exámenes y aciertos/fallos por pregunta.
            </>,
            <>
              <strong>Perfil y personalización:</strong> avatar elegido, código de amigo, y las preferencias de
              visibilidad que configures en Ajustes.
            </>,
            <>
              <strong>Función de amigos:</strong> tus relaciones de amistad y, si eliges ser visible, tu nombre, avatar,
              nivel, XP y estadísticas agregadas de examen — visibles solo para las personas con las que tengas amistad
              aceptada. Tu email no se comparte nunca con otros usuarios.
            </>,
            <>
              <strong>Datos de suscripción Premium:</strong> si contratas Premium, Stripe (nuestro procesador de pagos)
              nos indica el estado de tu suscripción; nosotros no almacenamos ni vemos los datos de tu tarjeta.
            </>,
            <>
              <strong>Preferencias técnicas locales:</strong> tema, ajustes de sonido/vibración y estado de onboarding,
              guardados en el almacenamiento local de tu navegador (ver{' '}
              <Link to="/cookies" style={{ fontWeight: 600 }}>
                Política de cookies
              </Link>
              ).
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. Para qué usamos tus datos">
        <LegalList
          items={[
            'Crear y gestionar tu cuenta, y permitirte iniciar sesión.',
            'Guardar y sincronizar tu progreso, XP, racha y estadísticas entre dispositivos.',
            'Ofrecer las funciones sociales que actives voluntariamente: buscar amigos, ver su perfil o el ranking semanal entre amigos.',
            'Gestionar tu suscripción Premium, si la contratas.',
            'Enviarte los emails estrictamente necesarios para el funcionamiento de la cuenta (confirmación de registro, recuperación de contraseña) y, si lo activas, notificaciones push sobre solicitudes de amistad, duelos o recordatorios de racha.',
            'Mantener la seguridad del servicio y prevenir abusos.',
          ]}
        />
        <LegalParagraph>
          No utilizamos tus datos con fines publicitarios ni los cedemos a terceros para marketing. Roady no incluye
          ningún sistema de analítica de uso ni de rastreo de terceros.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="4. Base jurídica del tratamiento">
        <LegalList
          items={[
            <>
              <strong>Ejecución de un contrato</strong> (art. 6.1.b RGPD): crear tu cuenta, guardar tu progreso y
              gestionar tu suscripción Premium son necesarios para prestarte el servicio que solicitas al registrarte.
            </>,
            <>
              <strong>Consentimiento</strong> (art. 6.1.a RGPD): activar las funciones sociales (búsqueda, compartir tu
              perfil con amigos) y las notificaciones push son opcionales y las activas tú mismo en Ajustes; puedes
              retirar tu consentimiento en cualquier momento desactivándolas.
            </>,
            <>
              <strong>Obligación legal</strong> (art. 6.1.c RGPD): conservación de determinada información de facturación
              cuando existe una suscripción de pago, por la normativa fiscal y de consumidores aplicable.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Con quién compartimos tus datos">
        <LegalParagraph>Solo trabajamos con los proveedores estrictamente necesarios para operar el servicio:</LegalParagraph>
        <LegalList
          items={[
            <>
              <strong>Supabase</strong> (base de datos, autenticación y envío de emails de cuenta).
            </>,
            <>
              <strong>Vercel</strong> (alojamiento de la aplicación y de sus funciones de servidor).
            </>,
            <>
              <strong>Stripe</strong> (procesamiento de pagos de la suscripción Premium, si la contratas). Stripe recibe
              tus datos de pago directamente; nosotros solo recibimos confirmación del estado de la suscripción.
            </>,
            <>
              <strong>Google Fonts</strong>: al cargar la app, tu navegador solicita directamente a los servidores de
              Google una tipografía usada en el logotipo. Esto implica una petición técnica a Google (con tu IP y
              user-agent), sin que nosotros compartamos datos adicionales con Google. Más detalle en la{' '}
              <Link to="/cookies" style={{ fontWeight: 600 }}>
                Política de cookies
              </Link>
              .
            </>,
          ]}
        />
        <LegalParagraph>
          No utilizamos herramientas de analítica, publicidad ni servicios de inteligencia artificial que envíen tus
          datos a terceros. Si en el futuro se incorpora alguna de estas herramientas, actualizaremos esta política
          antes de activarla.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="6. Sistema de amigos y ranking">
        <LegalParagraph>
          Roady no tiene un ranking público ni un directorio abierto de usuarios. Tu perfil solo es localizable por
          otros usuarios si activas la opción "Aparecer en la búsqueda", y tus estadísticas detalladas solo son visibles
          para amistades que hayas aceptado mutuamente y solo si mantienes activa "Compartir tu perfil con amigos". Puedes
          cambiar ambas opciones en cualquier momento desde Ajustes → Privacidad y amigos.
        </LegalParagraph>
        <LegalParagraph>
          Puedes bloquear a cualquier usuario (deja de poder encontrarte, enviarte solicitudes o retarte a un duelo,
          y tú dejas de ver su perfil) y denunciar un comportamiento inadecuado en cualquier momento, desde el perfil de
          esa persona o desde una solicitud recibida. La lista de personas que has bloqueado, y la opción de
          desbloquearlas, está disponible en Ajustes → Usuarios bloqueados. Los datos de una denuncia (motivo, detalles
          que añadas y a quién denuncias) se guardan para poder revisarla y no se comparten con la persona denunciada.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="7. Cuánto tiempo conservamos tus datos">
        <LegalParagraph>
          Conservamos tus datos mientras mantengas tu cuenta activa. Si eliminas tu cuenta desde Ajustes, tu perfil,
          progreso, estadísticas y relaciones de amistad se eliminan de forma permanente e inmediata. Los datos de
          facturación de una suscripción, si los hubiera, podrían conservarse el tiempo exigido por la normativa fiscal
          aplicable, aunque el resto de tu cuenta ya haya sido eliminado.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="8. Tus derechos">
        <LegalParagraph>
          Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación
          del tratamiento y portabilidad de tus datos, así como retirar tu consentimiento cuando el tratamiento se base
          en él:
        </LegalParagraph>
        <LegalList
          items={[
            <>
              <strong>Acceso y rectificación:</strong> desde tu Perfil y Ajustes puedes consultar y corregir tus datos
              directamente.
            </>,
            <>
              <strong>Supresión:</strong> desde Ajustes → Eliminar cuenta, de forma inmediata y sin necesidad de
              contactarnos.
            </>,
            <>
              <strong>Resto de derechos:</strong> escribiendo a {LEGAL_CONTACT_EMAIL}.
            </>,
          ]}
        />
        <LegalParagraph>
          Si consideras que el tratamiento de tus datos no se ajusta a la normativa, también puedes presentar una
          reclamación ante la Agencia Española de Protección de Datos (AEPD), www.aepd.es.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="9. Menores de edad">
        <LegalParagraph>
          Roady es una aplicación educativa orientada a la preparación del examen teórico de conducir, que en España
          puede iniciarse legalmente antes de obtener el permiso. Conforme al artículo 7 de la LOPDGDD, un menor de edad
          puede prestar su propio consentimiento para el tratamiento de sus datos personales a partir de los 14 años.
          Si tienes entre 14 y 17 años puedes registrarte y usar Roady con tu propio consentimiento; si tienes menos de
          14 años, necesitas el consentimiento de tu madre, padre o tutor legal para crear una cuenta.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="10. Seguridad">
        <LegalParagraph>
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos: acceso a la base de datos
          restringido mediante autenticación y reglas de seguridad a nivel de fila (cada usuario solo puede leer sus
          propios datos privados), contraseñas gestionadas y cifradas por nuestro proveedor de autenticación, y
          separación estricta entre las claves públicas usadas en la aplicación y las claves privadas usadas solo en
          nuestros servidores.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="11. Cambios en esta política">
        <LegalParagraph>
          Podemos actualizar esta política para reflejar cambios en la aplicación o en la normativa aplicable. Si el
          cambio es significativo, te lo notificaremos dentro de la app. La fecha de la última actualización figura al
          principio de este documento.
        </LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
}
