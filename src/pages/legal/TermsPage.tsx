import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection, LegalParagraph, LegalList } from '../../components/legal/LegalDocument';
import { LEGAL_CONTACT_EMAIL } from '../../data/legalInfo';

export function TermsPage() {
  return (
    <LegalDocument
      title="Términos y condiciones"
      intro="Estas condiciones regulan el uso de Roady, incluida la suscripción Premium. Al crear una cuenta, las aceptas."
    >
      <LegalSection heading="1. Descripción del servicio">
        <LegalParagraph>
          Roady es una aplicación educativa para preparar el examen teórico del permiso de conducción B, con lecciones,
          práctica libre, simulacros de examen y funciones sociales (amigos, ranking entre amigos, duelos). Parte de
          estas funciones son gratuitas y otras forman parte de la suscripción Premium descrita más abajo.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Cuenta de usuario">
        <LegalList
          items={[
            'Necesitas crear una cuenta con email y contraseña para usar Roady; no existe modo invitado.',
            'Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.',
            'Debes proporcionar información veraz al registrarte.',
            <>
              Puedes eliminar tu cuenta en cualquier momento desde Ajustes → Eliminar cuenta, de forma permanente e
              inmediata (ver{' '}
              <Link to="/privacidad" style={{ fontWeight: 600 }}>
                Política de privacidad
              </Link>
              ).
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. Uso aceptable">
        <LegalParagraph>Al usar las funciones sociales de Roady (amigos, duelos), te comprometes a:</LegalParagraph>
        <LegalList
          items={[
            'No suplantar la identidad de otra persona.',
            'No usar la aplicación para acosar, molestar o enviar spam a otros usuarios.',
            'No intentar acceder a datos de otros usuarios eludiendo los controles de privacidad de la app.',
          ]}
        />
        <LegalParagraph>
          Podemos suspender o cancelar cuentas que incumplan estas condiciones de forma grave o reiterada. Si otro
          usuario incumple estas normas contigo, puedes bloquearlo y denunciarlo directamente desde su perfil o desde
          una solicitud recibida.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="4. Suscripción Premium">
        <LegalParagraph>
          Roady ofrece una suscripción de pago opcional ("Premium") que amplía los límites diarios de práctica y duelos
          disponibles en el plan gratuito, y desbloquea contenido adicional (por ejemplo, avatares exclusivos). El plan
          gratuito permite un número limitado de sesiones de práctica y duelos por día; puedes consultar el precio
          vigente de Premium en la propia aplicación antes de contratarlo.
        </LegalParagraph>
        <LegalList
          items={[
            <>
              <strong>Pago y procesamiento:</strong> los pagos se procesan a través de Stripe, un proveedor de pagos
              externo. Roady no almacena los datos de tu tarjeta.
            </>,
            <>
              <strong>Renovación automática:</strong> la suscripción Premium se renueva automáticamente al final de cada
              periodo de facturación, salvo que la canceles antes de esa fecha.
            </>,
            <>
              <strong>Cancelación:</strong> puedes cancelar tu suscripción en cualquier momento desde el panel de
              gestión de suscripción accesible desde Ajustes. La cancelación surte efecto al final del periodo ya
              pagado; no se realizan devoluciones proporcionales por el tiempo restante, salvo que la ley aplicable
              disponga otra cosa.
            </>,
            <>
              <strong>Derecho de desistimiento:</strong> como consumidor, dispones de un plazo de 14 días naturales
              desde la contratación para desistir sin necesidad de justificación, conforme al Real Decreto Legislativo
              1/2007 (texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios). Si empiezas a
              usar las funciones Premium antes de que termine ese plazo, nos das tu consentimiento expreso para el
              inicio inmediato del servicio, lo que implica que pierdes el derecho de desistimiento una vez el servicio
              se haya prestado por completo, y lo pierdes de forma proporcional al tiempo ya disfrutado si desistes
              antes de que termine.
            </>,
            <>
              <strong>Cambios de precio:</strong> si modificamos el precio de la suscripción, no afectará a un periodo ya
              pagado; te avisaremos con antelación razonable de cualquier cambio antes de tu siguiente renovación.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Contenido educativo">
        <LegalParagraph>
          El contenido de Roady (preguntas, explicaciones, diagramas) tiene finalidad educativa y se elabora a partir de
          fuentes oficiales de la DGT, pero no sustituye la formación de una autoescuela ni garantiza el resultado del
          examen oficial. Consulta el{' '}
          <Link to="/aviso-legal" style={{ fontWeight: 600 }}>
            Aviso legal
          </Link>{' '}
          para más detalle sobre propiedad intelectual y exclusión de responsabilidad.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="6. Modificación de estas condiciones">
        <LegalParagraph>
          Podemos actualizar estas condiciones para reflejar cambios en el servicio o en la normativa aplicable. Si el
          cambio es significativo (por ejemplo, en las condiciones de la suscripción Premium), te lo notificaremos
          dentro de la app antes de que entre en vigor.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="7. Contacto">
        <LegalParagraph>Para cualquier duda sobre estas condiciones, puedes escribir a {LEGAL_CONTACT_EMAIL}.</LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
}
